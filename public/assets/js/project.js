let app = {

    init: function() {

    let quickviews = bulmaQuickview.attach(); // quickview
    let width;
    let cardID;
    let descriptionContent;
    let cardTitle;

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

        let cardID = jQuery(this).attr("card-id");

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
                        +           '<p class="is-size-5 mb-2"><i class="fas fa-align-left mr-1"></i>Description<button class="button is-small is-info description-area descriptionContent btn-m-description ml-1">Modifier</button></p>'
                        +           '<p class="is-size-6 descriptionContent description-area description">' + response[0].description + '</p>'
                        +       '</div>'
                        +       '<div class="column is-6 col-t is-size-5">'
                        +           '<p><i class="fas fa-tags mr-1"></i>Etiquettes</p>'
                        +       '</div>'
                        +       '<div class="column is-12 col-t is-size-5">'
                        +           '<p><i class="far fa-check-square mr-1"></i></i>Etapes</p>'
                        +       '</div>'
                        +       '<div class="column is-12 col-t is-size-5 mb-test">'
                        +           '<p><i class="fas fa-comment mr-1"></i></i></i>Commentaires</p>'
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
                        $('.descriptionContent').on('click', app.addEventModifyDescription);
                        $('.modal-card-head').on('click', app.addEventModifyTitle);
                     }
        
                    }).fail(function() {
                        //$('.result-search-content').html('Erreur de chargement');
                    });
    },

    addEventModifyDescription : function() {

        app.descriptionContent = $('.modal-card-big').find('.description').text();

        $('.modal-card-big').find('.description').html(
        '<div class="control">'
        +  '<textarea class="textarea description-area is-focused" placeholder="Description">'
        +   '</textarea>'
        + '</div>');

        $('<div class="buttons description--buttons mt-1"><button class="button description--save is-success mr-1">Enregistrer</button><button class="button is-danger description--cancel">Annuler</button></div>').insertAfter('p.description-area');

        $('.description-area').focus().val(app.descriptionContent);

        let events = $('.modal-card-big').find('.descriptionContent');

        $(events.each( function() {
            $(this).unbind('click');
        }));

        // Hide button
        $('.btn-m-description').hide();

        $(window).click(function (event) {

            if ($(event.target).closest(".description--cancel").length) {
                console.log('annuler clicked');
                $(window).unbind('click');
                $('.modal-card-big').find('.description--buttons').remove();
                $('.modal-card-big').find('.description').html(app.descriptionContent);
                $('.modal-card-big').find('.description').addClass('descriptionContent');
                // Refresh event
                $(events.each( function() {
                    $(this).click(app.addEventModifyDescription);
                }));
                $('.btn-m-description').show();
               return false;
            }

            else if ((!$(event.target).closest(".description-area").length) || ($(event.target).closest(".description--save").length)) {
                
                console.log('clicked outside textarea');
                // Unbind click
                $(window).unbind('click');
                // Récupération contenu textarea
                let newDescription = $('.modal-card-big').find('.textarea').val();

                // A FAIRE : Si la valeur du textarea est différente de la valeur récup de base, requête AJAX à envoyer
                if (newDescription !== app.descriptionContent) {
                    // Requête AJAX à envoyer

                }

                // Suppression du DOM
                $('.modal-card-big').find('.textarea').remove();
                $('.modal-card-big').find('.description--buttons').remove();
                // Ajout du contenu dans le DOM
                $('.modal-card-big').find('.description').html(newDescription);
                // Refresh event
                $(events.each( function() {
                    $(this).click(app.addEventModifyDescription);
                }));
                $('.btn-m-description').show();
            }
        });
    },

    addEventModifyTitle : function() {

        app.cardTitle = $('.modal-card-big').find('.modal-card-title').text();

        $('.modal-card-big').find('.modal-card-title').html(
              '<div class="field">'
            +  '<div class="control">'
            +    '<input class="input input-title is-info" type="text">'
            +  '</div>'
            + '</div>');

            $('.input-title').focus().val(app.cardTitle);

            $('.modal-card-head').off();    

        $(window).click(function (event) {

            if (!$(event.target).closest('.modal-card-head').length) {
                // Si la valeur de l'input a changé -> Requête ajax sinon on repasse à la valeur d'origine
                console.log('clicked outside modal-card-head')
                $(window).unbind('click');
                let newTitle = $('.input-title').val();

                //console.log('Nouvelle valeur title : ' + app.cardTitle)

                // A FAIRE : Si la valeur de l'input est différente de la valeur récup de base, requête AJAX à envoyer + mettre à jour le DOM
                /*if (newTitle !== app.cardTitle) {
                    // Requête AJAX à envoyer

                }*/

                $('.modal-card-title').html(
                    newTitle
                );
                

               $('.modal-card-head').on('click', app.addEventModifyTitle);
            }

        });

    },
};

$(app.init);