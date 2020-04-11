let app = {

    init: function() {
    // Déclaration variables
    let quickviews = bulmaQuickview.attach(); // quickview
    let width;
    let cardID;
    let currentCard;
    let descriptionContent;
    let cardTitle;
    let lastEventName;
    let events;

    // Bind events
    $("#modal").click(function() {
        $(".modal").addClass("is-active");  
    });

    $(".close").click(function() {
        $(".modal").removeClass("is-active");
    });

    $(".modal-background").click(function() {
        $(".modal").removeClass("is-active");
    });

    $(".task").click(function() {
    let statusType = jQuery(this).attr("s-type");
    let pathname = window.location.pathname.split("/");
    let id = pathname[pathname.length-1];
    window.location.href="http://127.0.0.1:8001/p/" + id + "?t=" + statusType; 
    });

    // Préparation drag & drop
    let currentStatusOnPage = $('body').find('p.panel-heading').attr('s-type');
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').addClass('t');
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('task');
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('p.heading').prepend('<i class="fas fa-arrow-right mr-1"></i>');

    $(".show-card").draggable({
        start: function( event, ui ) {
            app.width = $(this).width();
            app.cardID = $(this).attr('card-id');
            $(this).addClass('currentDrag');
            $(this).width(50);
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').addClass('background-is-red');
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('task');
        },
        revert : function(event , ui) {
            $(this).width(app.width);
            $(this).removeClass('currentDrag');
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('background-is-red');

            if (event) {
                return event;
            }
            else
                return !event;
            },
        cursor: "move", cursorAt: { top: 56, left: 56 },
    });

    $(".task").droppable({
        valid: '.task',
        drop: function(event, ui) {
            
            let status = $(this).closest('div.column').attr('s-type');
            idCard = app.cardID;

            if ((status == 'new') || (status == 'inProgress') || (status == 'finished'))
            {
                $.ajax({
                    url: '/changeCardStatus', 
                    method: 'POST', 
                    dataType: 'json',
                    data: {
                            idCard,
                            status
                          }
                    }).done(function(response) {

                });
                //
                $('body').find('.currentDrag').remove();
                // Incrémentation compteur destination
                let total = parseInt($(this).find('.title').text());
                total = total + 1;
                $(this).find('.title').html(total);

                // Décrémentation compteur tâche courante
                total = $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('.title').text();
                total = total - 1;
                $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('.title').html(total);

                $(this).css("border", "none");
            }

            },
        over: function(event, ui) {
            $(this).css("border", "5px solid #fff");
            },
        out: function(event, ui) {
            $(this).css("border", "none");
        }
    });

    $('.show-card').click(app.showCard);

},
     // #######################################################################
    // showCard function
    // Méthode permettant d'afficher la modal + récupération de la data lors d'un click sur une card
    // #######################################################################

    showCard: function() {

        app.currentCard = $(this);
        let cardID = app.currentCard.attr("card-id");

        $.ajax({
                 url: '/getCardData', 
                 method: 'POST', 
                 dataType: 'json',
                 data: {
                         cardID,
                       }
                 }).done(function(response) {
                     if (response['Error'] == 'Accès non autorisé') {
                     // Afficher un pop up d'erreur ?
                     }

                     if (response !== undefined) {
                        let responseHTML = '';

                        responseHTML += 
                        '<div class="modal has-text-dark currentCard is-active">'
                        + '<div class="modal-background"></div>'
                        + '<div class="modal-card-big">'
                        +   '<header class="modal-card-head">'
                        +      '<p class="modal-card-title">' + response[0].name + '</p>'
                        +      '<button class="delete close" aria-label="close"></button>'
                        +   '</header>'
                        +   '<div class="columns is-multiline has-text-centered nm">'
                        +       '<div class="column is-6 col-t">'
                        +           '<p class="is-size-5 mb-2"><i class="fas fa-align-left mr-1"></i>Description<button class="button is-small is-info description-area descriptionContent btn-m-description ml-1"> <span class="icon is-small"> <i class="fas fa-edit"></i> </span> <span>Modifier</span> </button></p>'
                        +           '<p class="is-size-6 descriptionContent description-area description">' + response[0].description + '</p>'
                        +       '</div>'
                        +       '<div class="column is-6 col-t is-size-5">'
                        +           '<p><i class="fas fa-tags mr-1"></i>Etiquettes</p>'
                        +       '</div>'
                        +       '<div class="column is-12 col-t is-size-5 steps">'
                        +           '<p><i class="far fa-check-square mr-1"></i></i>Etapes<button class="button is-small is-info s-add ml-1"> <span class="icon is-small"><i class="fas fa-plus-square"></i></span> <span>Ajouter</span></button></p>'
                        +       '</div>'
                        +       '<div class="column is-12 col-t is-size-5 mb-test">'
                        +           '<p><i class="fas fa-comment mr-1"></i></i></i>Commentaires</p>'
                        +           '<div class="field">'
                        +               '<div class="control">'
                        +                   '<input class="input is-info c-add" type="text" placeholder="Commentaire...">'
                        +               '</div>'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>'
                        +   '<footer class="modal-card-foot">'
                        +      '<button class="button is-success">Démarrer cette tâche</button>'
                        +      '<button class="button close">Fermer</button>'
                        +   '</footer>'
                        + '</div>'
                        +'</div>';
                            
                        $('body').append(responseHTML);

                        // Refresh event
                        $(".close").click(function() {
                            $(".currentCard").remove();
                        });

                        $(".modal-background").click(function() {
                            $(".currentCard").remove();
                        });
                        //

                        // ADD events
                        $('.modal-card-head').click(app.addEventModifyTitle);
                        $('.descriptionContent').click(app.addEventModifyDescription);
                        $('.s-add').click(app.addEventNewStep);
                        $('.c-add').keypress(app.addEventNewComment);
                     }
        
                    }).fail(function() {
                        //$('.result-search-content').html('Erreur de chargement');
                    });
    },

    // Modification de la description d'une card lors du clic
    addEventModifyDescription : function() {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventModifyDescription';

        app.descriptionContent = $('.modal-card-big').find('.description').text();

        $('.modal-card-big').find('.description').html(
        '<div class="control">'
        +  '<textarea class="textarea description-area is-focused" placeholder="Description">'
        +   '</textarea>'
        + '</div>');

        $('<div class="buttons description--buttons mt-1"><button class="button description--save is-success mr-1">Enregistrer</button><button class="button is-danger description--cancel">Annuler</button></div>').insertAfter('p.description-area');

        $('.description-area').focus().val(app.descriptionContent);

        app.events = $('.modal-card-big').find('.descriptionContent');

        $(app.events.each( function() {
            $(this).unbind('click');
        }));

        // Hide button
        $('.btn-m-description').hide();

        $(window).click(function (event) {

            console.log('load event window description')

            if ($(event.target).closest(".description--cancel").length) {
                console.log('annuler clicked');
                $(this).unbind('click');
                $('.modal-card-big').find('.description--buttons').remove();
                $('.modal-card-big').find('.description').html(app.descriptionContent);
                $('.modal-card-big').find('.description').addClass('descriptionContent');
                // Refresh event
                $(app.events.each( function() {
                    $(this).click(app.addEventModifyDescription);
                }));
                $('.btn-m-description').show();
                app.lastEventName = undefined;
                app.events = undefined;
                return false;
            }

            else if ((!$(event.target).closest(".description-area").length) || ($(event.target).closest(".description--save").length)) {
                app.finishLastEvent(app.lastEventName);
            }
                
        });
    },

    // Modification du titre d'une card lors du clic
    addEventModifyTitle : function(e) {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventModifyTitle';

        app.cardTitle = $('.modal-card-big').find('.modal-card-title').text();

        $('.modal-card-big').find('.modal-card-title').html(
              '<div class="field">'
            +  '<div class="control">'
            +    '<input class="input input-title is-info" type="text">'
            +  '</div>'
            + '</div>');

        $('.input-title').focus().val(app.cardTitle);

        $(this).off();

        $('.input-title').keypress(function(e) { 
            if(e.which == 13) {
                // Touche entree pressée
                app.finishLastEvent(app.lastEventName);
                $(this).off
            }
        });
    
        $(window).click(function (event) {
            if (!$(event.target).closest('.modal-card-head').length) {
                app.finishLastEvent(app.lastEventName);
            }
        });
    },

    // Ajout d'une nouvelle étape sur une card
    addEventNewStep : function() {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventNewStep';

        // Ajout d'un input dans le DOM
        $('.steps').append(
              '<div class="field mt-1 step">'
            +   '<div class="control">'
            +    '<input class="input input-step s-add is-info" type="text" placeholder="Etape">'
            +   '</div>'
            + '</div>');

        $(this).off();
        $('.input-step').focus();

        $('.s-add').keypress(function(e) { 
            if (e.which == 13) {
                // Touche entree pressée
                app.finishLastEvent(app.lastEventName);
                $(this).off();
                return false;
            }
        });

        $(window).click(function (event) {
            if (!$(event.target).closest(".s-add").length) {
                app.finishLastEvent(app.lastEventName);
            }
        });

    },

    // Ajout d'un nouveau commentaire sur une card
    addEventNewComment : function(e) {

            if(e.which == 13) {
                // Touche entree pressée
                if ($.trim($('.c-add').val()) !== '') {
                    // Requête AJAX à envoyer + ajout au DOM
                    console.log('Ajax request')
                    // On vide l'input
                    $('.c-add').val('');
                    // Ajout au DOM

                }
            }

    },

    finishLastEvent: function(lastEventName) {

            if ((lastEventName) == 'addEventModifyTitle')
            {
                    console.log('finish event ModifyTitle');
                    $(window).off();
                    let newTitle = $('.input-title').val();

                    // A FAIRE : Si la valeur de l'input est différente de la valeur récup de base, requête AJAX à envoyer + mettre à jour le DOM (card dans le body)
                    if (newTitle !== app.cardTitle) {
                        // Requête AJAX à envoyer
                        console.log('Ajax request');

                        // Mise à jour du titre de la carte dans le DOM
                        app.currentCard.find('.c-name').html(newTitle);
                    }

                    $('.modal-card-title').html(
                        newTitle
                    );
                    app.lastEventName = undefined;
                    $('.modal-card-head').click(app.addEventModifyTitle);
            }

            if ((lastEventName) == 'addEventModifyDescription')
            {
                    $(window).off();
                    console.log('finish event ModifyDescription');
                    // Récupération contenu textarea
                    let newDescription = $('.modal-card-big').find('.textarea').val();

                    // A FAIRE : Si la valeur du textarea est différente de la valeur récup de base, requête AJAX à envoyer
                    if (newDescription !== app.descriptionContent) {
                        // Requête AJAX à envoyer
                        console.log('Ajax request')

                    }

                    // Suppression du DOM
                    $('.modal-card-big').find('.textarea').remove();
                    $('.modal-card-big').find('.description--buttons').remove();
                    // Ajout du contenu dans le DOM
                    $('.modal-card-big').find('.description').html(newDescription);
                    // Refresh event
                    $(app.events.each( function() {
                        $(this).click(app.addEventModifyDescription);
                    }));
                    app.lastEventName = undefined;
                    $('.btn-m-description').show();
            }

            if ((lastEventName) == 'addEventNewStep')
            {
                console.log('finish event NewStep');
                $(window).off();
                
                if ($.trim($('.input-step').val()) !== '') {
                    // Requête AJAX à envoyer + ajout au DOM
                    console.log('Ajax request')
                    $('.step').remove();

                }
                else {
                    // Aucune valeur, on remove du DOM
                    $('.step').remove();
                }
                
                $('.s-add').on('click', app.addEventNewStep);
                app.lastEventName = undefined;
            }
        },
};

$(app.init);