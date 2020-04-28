let app = {

    init: function() {
    // Déclaration variables
    let quickviews = bulmaQuickview.attach(); // quickview
    let width;
    let cardID;
    let currentCard;
    let descriptionContent;
    let cardName;
    let lastEventName;
    let events;
    let user;
    let userEmail;
    let colorLabel;
    let boolAddClass;

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

    $(app.addDragAndDrop());

    $('.show-card').click(app.showCard);

},
    // #######################################################################
    // showCard function
    // Méthode permettant de récupérer la data + affichage modal d'une card
    // #######################################################################
    showCard: function() {

        app.currentCard = $(this);
        let cardID = app.currentCard.attr("card-id");
        app.cardID = cardID;

        $.ajax({
                 url: '/getCardData', 
                 method: 'POST', 
                 dataType: 'json',
                 data: {
                         cardID,
                       }
                 }).done(function(response) {
                    console.log(response['Error']);
                     if (response['Error'] == 'Accès non autorisé') {
                        // Afficher un pop up d'erreur ?
                        console.log('Error : Not authorized')
                     }

                     else {

                      if ((response !== undefined) && (response['Error'] == undefined))
                       {
                        console.log(response[0]);
                        app.user = response[0].userConnected;
                        app.userEmail = response[0].userEmail;
                        let comments = (response[0].comments);

                        let responseHTML = '';

                        responseHTML += 
                        '<div class="modal has-text-dark currentCard is-active">'
                        + '<div class="modal-background"></div>'
                        + '<div class="modal-card-big">'
                        +   '<header class="modal-card-head">'
                        +      '<p class="modal-card-title">' 
                        +           response[0].name 
                        +      '</p>'
                        +      '<button class="delete close" aria-label="close">'
                        +      '</button>'
                        +   '</header>'
                        +   '<div class="columns is-multiline has-text-centered nm">'
                        +       '<div class="column is-6 col-t">'
                        +           '<p class="is-size-5 mb-2">'
                        +                '<i class="fas fa-align-left mr-1">'
                        +                '</i>'
                        +            'Description'
                        +            '<button class="button is-small is-info description-area descriptionContent btn-m-description ml-1">'
                        +                '<span class="icon is-small">'
                        +                    '<i class="fas fa-edit">'
                        +                    '</i>' 
                        +                '</span>'
                        +                '<span>Modifier</span>'
                        +            '</button>'
                        +           '</p>'
                        +           '<p class="is-size-6 descriptionContent description-area description">' 
                        +               response[0].description
                        +           '</p>'
                        +       '</div>'
                        +       '<div class="column is-6 col-t is-size-5">'
                        +               '<i class="fas fa-tags mr-1">'
                        +               '</i>'
                        +               'Etiquettes'
                        +            '<div class="dropdown dropdown-labels">'
                        +              '<div class="dropdown-trigger">'
                        +                '<button class="button button-l is-small is-info ml-1" aria-haspopup="true" aria-controls="dropdown-menu2">'
                        +                    '<span>Gérer</span>'
                        +                    '<span class="icon is-small">'
                        +                    '<i class="fas fa-angle-down" aria-hidden="true"></i>'
                        +                    '</span>'
                        +                '</button>'
                        +                '</div>'
                        +                '<div class="dropdown-menu dropdown-menu-labels border-is-gray" id="dropdown-menu2" role="menu">'
                        +                '<div class="dropdown-content has-text-black">'
                        +                    '<div class="dropdown-item has-text-black">'
                        +                       '<p class="is-size-5">'
                        +                           '<i class="fas fa-tags mr-1"></i> Etiquettes ('
                        +                           '<span class="labels-count">'
                        +                           '0'
                        +                           '</span>)'
                        +                          '<div class="field is-grouped labels mt-1 is-grouped-multiline is-size-5">'
                        +                            '</div>'
                        +                       '</p>'
                        +                    '</div>'
                        +                    '<hr class="dropdown-divider">'
                        +                    '<div class="has-text-centered">'
                        +                       '<i class="fas fa-tag mr-1"></i> Nouvelle étiquette'
                        +                    '</div>'
                        +                    '<div class="dropdown-item">'
                        +                       '<input class="input input--label" type="text" placeholder="Nom de l\'étiquette">'
                        +                           '<span class="control has-icons-left">'
                        +                               '<div class="select ml-1">'
                        +                                   '<select id="labels-select" class="is-blue-label">'
                        +                                    '<option selected class="is-blue-label" value="1" data-color="blue">Bleu</option>'
                        +                                    '<option value="2" class="select-label is-white-label" data-color="white">Blanc</option>'
                        
                        +                                    '<option class="is-yellow-label" value="3" data-color="yellow">Jaune</option>'
                        +                                    '</select>'
                        +                                    '<div class="icon is-small is-left">'
                        +                                       '<i class="fas fa-tint"></i>'
                        +                                    '</div>'
                        +                                '</div>'
                        +                           '</span>'
                        +                           '<button class="l-add button is-success ml-1">OK</button>'
                        +                               '</div>'
                        +                '</div>'
                        +                '</div>'
                        +            '</div>'
                        +        '</div>'
                        +       '<div class="column is-12 col-t is-size-5 steps">'
                        +           '<p>'
                        +               '<i class="far fa-check-square mr-1">'
                        +               '</i>'
                        +               'Etapes'
                        +               '<button class="button is-small is-info s-add ml-1">'
                        +                   '<span class="icon is-small">'
                        +                       '<i class="fas fa-plus-square">'
                        +                       '</i>'
                        +                   '</span>'
                        +                   '<span>'
                        +                       'Ajouter'
                        +                   '</span>'
                        +               '</button>'
                        +           '</p>'
                        +       '</div>'
                        +       '<div class="column is-12 col-t is-size-5">'
                        +           '<p>'
                        +               '<i class="fas fa-comment mr-1">'
                        +               '</i>'
                        +               'Commentaires'
                        +           '</p>'
                        +           '<div class="field mt-1">'
                        +               '<div class="control">'
                        +                   '<input class="input is-info c-add" type="text" placeholder="Commentaire...">'
                        +               '</div>'
                        +           '<div class="comments mt-2">'
                        +           '</div>'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>'
                        +   '<footer class="modal-card-foot">'
                        +      '<button class="button is-success">'
                        +       'Démarrer cette tâche'
                        +      '</button>'
                        +      '<button class="button close">'
                        +       'Fermer'
                        +      '</button>'
                        +   '</footer>'
                        + '</div>'
                        +'</div>';
                            
                        $('body').append(responseHTML);

                        // Affichage des commentaires
                        $.each(comments, function (index, value) {
                            $('.comments').append(
                            '<div class="user-comment mt-2">'
                            + '<i class="fas fa-user-ninja mr-1">'
                            + '</i>'
                            + value.mail 
                            +   '<div class="comment has-background-white-ter mt-2">'
                            +       value.content 
                            +   '</div>'
                            +'</div>');
                        });

                        // Refresh event
                        $(".close").click(function() {
                            $(".currentCard").remove();
                        });

                        $(".modal-background").click(function() {
                            $(".currentCard").remove();
                        });
                        //

                        // ADD events
                        $('.modal-card-head').click(app.addEventModifyName);
                        $('.descriptionContent').click(app.addEventModifyDescription);
                        $('.s-add').click(app.addEventNewStep);
                        $('.c-add').keypress(app.addEventNewComment);
                        $('.dropdown-labels').click(app.addEventNewLabel);
                     }
                    }
                    }).fail(function() {
                        //$('.result-search-content').html('Erreur de chargement');
                });
    },

    // #######################################################################
    // addEventModifyDescription function
    // Méthode permettant de gérer la modification de la description d'une card
    // #######################################################################
    addEventModifyDescription : function() {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventModifyDescription';

        app.descriptionContent = $('.modal-card-big').find('.description').html().replace(/<br>/g, '\n');

        $('.modal-card-big').find('.description').html(
         '<div class="control">'
        +  '<textarea class="textarea description-area is-focused" placeholder="Description">'
        +  '</textarea>'
        +'</div>');

        // Ajout du bouton annuler dans le DOM
        $( '<div class="buttons description--buttons mt-1">'
          + '<button class="button description--save is-success mr-1">'
          +     'Enregistrer'
          + '</button>'
          + '<button class="button is-danger description--cancel">'
          +     'Annuler'
          + '</button>'
          +'</div>').insertAfter('p.description-area');

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
                // Add <br>
                let description = app.descriptionContent.replace( /\r?\n/g, "<br>" );
                //
                $('.modal-card-big').find('.description').html(description);
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

    // #######################################################################
    // addEventModifyName function
    // Méthode permettant de gérer la modification du titre d'une card
    // #######################################################################
    addEventModifyName : function(e) {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventModifyName';

        app.cardName = $.trim($('.modal-card-big').find('.modal-card-title').text());

        $('.modal-card-big').find('.modal-card-title').html(
              '<div class="field">'
            +  '<div class="control">'
            +    '<input class="input input-title is-info" type="text">'
            +  '</div>'
            + '</div>');

        $('.input-title').focus().val(app.cardName);

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

    // #######################################################################
    // addEventNewStep function
    // Méthode permettant de gérer l'ajout d'une nouvelle étape sur une card
    // #######################################################################
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

    // #######################################################################
    // addEventNewComment function
    // Méthode permettant de gérer l'ajout d'un nouveau commentaire sur une card
    // #######################################################################
    addEventNewComment : function(e) {

        if(e.which == 13) {
            // Touche entree pressée
            let contentComment = $.trim($('.c-add').val());
            let idCard = app.cardID;

            if ((contentComment) !== '') {
                // Requête AJAX à envoyer + ajout au DOM
                $.ajax({
                    url: '/addComment', 
                    method: 'POST', 
                    dataType: 'json',
                    data: {
                            idCard,
                            contentComment
                          }
                    }).done(function(response) {
                });
                // On vide l'input
                $('.c-add').val('');
                // Ajout au DOM
                $('.comments').prepend(
                     '<div class="user-comment mt-2">'
                    + '<i class="fas fa-user-ninja mr-1">'
                    + '</i>' 
                    + app.userEmail
                    +   '<div class="comment has-background-white-ter mt-2">'
                    +       contentComment 
                    +   '</div>'
                    +'</div>');
                // Cleaning
                contentComment = undefined;
            }
        }

    },

    //#######################################################################
    // addEventNewLabel function
    // Méthode permettant de gérer la modification de la description d'une card
    // #######################################################################
    addEventNewLabel : function(e) {

        // Vérifier si un évenement est déjà en cours
        if (app.lastEventName !== undefined) {
            // Clean l'événement en cours
            app.finishLastEvent(app.lastEventName);
        }

        app.lastEventName = 'addEventNewLabel';
        app.boolAddClass = true;

        // On affiche le menu
        $('.dropdown-labels').addClass('is-active');
        
        let currentLabelColorClass = 'is-' + $('#labels-select').find(':selected').data('color') + '-label';

        $('#labels-select').on('change', function() {
            let currentColor = $('#labels-select').find(':selected').data('color');
            app.colorLabel = currentColor;
            // Mise à jour couleur select
            $('#labels-select').removeClass(currentLabelColorClass);
            // On build la classe
            currentLabelColorClass = 'is-' + currentColor + '-label';
            // On rajoute la classe sur le select
            $('#labels-select').addClass(currentLabelColorClass);
        });

        $('.l-add').on('click', function() {
            labelName = $.trim($('.input--label').val());

            if (labelName != '') {
                // Ajout au DOM uniquement si validé côté backend (A FAIRE)
                $('.labels').append(
                     '<div class="control">'
                   +  '<div class="tags has-addons">'
                   +    '<a class="tag is-medium ' + currentLabelColorClass + '">' + labelName + '</a>'
                   +    '<a class="tag is-medium is-delete"></a>'
                   +  '</div>'
                   + '</div>');

                // UniqueID temporaire
                let uniqID = (([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));

                // Ajout événements deleteLabelFromProject + bindLabelToCard

                // Ajout du label dans le DOM de la card

                // Ajout du label dans le DOM de la task

                // Update compteur labels
                let labelsCount = parseInt($('.labels-count').text());
                labelsCount = labelsCount + 1;
                $('.labels-count').html(labelsCount);
            }
        });

        $(this).off();

        $(window).click(function (event) {
            if ((!$(event.target).closest('.dropdown-labels').length) || ($(event.target).closest('.dropdown-labels-close').length)) {
                app.finishLastEvent(app.lastEventName);
            }

            if (app.boolAddClass == true) {
                $('.button-l').addClass('dropdown-labels-close');
            }

        });
    },

    // #######################################################################
    // finishLastEvent function
    // Méthode permettant de terminer un évenement en cours avant d'en débuter un autre
    // #######################################################################
    finishLastEvent: function(lastEventName) {

            if ((lastEventName) == 'addEventModifyName')
            {
                    console.log('finish event ModifyName');
                    $(window).off();
                    let name = $.trim($('.input-title').val());
                    let idCard = app.cardID;

                    if (name !== app.cardName) {
                        // Requête AJAX à envoyer
                        $.ajax({
                            url: '/updateCardName', 
                            method: 'POST', 
                            dataType: 'json',
                            data: {
                                    idCard,
                                    name
                                  }
                            }).done(function(response) {
                        });

                        // Mise à jour du titre de la carte dans le DOM
                        app.currentCard.find('.c-name').html(name);
                    }

                    $('.modal-card-title').html(name);
                    // Cleaning
                    app.lastEventName = undefined;
                    idCard = undefined;
                    name = undefined;
                    $('.modal-card-head').click(app.addEventModifyName);
            }

            if ((lastEventName) == 'addEventModifyDescription')
            {
                    $(window).off();
                    // Récupération contenu textarea
                    let description = $('.modal-card-big').find('.textarea').val();
                    let idCard = app.cardID;

                    // Si la valeur du textarea est différente de la valeur récup de base on sauvegarde -> requête AJAX
                    if (description !== app.descriptionContent) {

                        description = description.replace( /\r?\n/g, "<br>" );
                        
                        $.ajax({
                            url: '/updateCardDescription', 
                            method: 'POST', 
                            dataType: 'json',
                            data: {
                                    idCard,
                                    description
                                  }
                            }).done(function(response) {
                        });
                    }

                    // Suppression du DOM
                    $('.modal-card-big').find('.textarea').remove();
                    $('.modal-card-big').find('.description--buttons').remove();
                    // Ajout du contenu dans le DOM
                    $('.modal-card-big').find('.description').html(description.replace( /\r?\n/g, "<br>" ));

                    // Refresh event
                    $(app.events.each( function() {
                        $(this).click(app.addEventModifyDescription);
                    }));
                    // Clean variable
                    description = undefined;
                    idCard = undefined;
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

            if ((lastEventName) == 'addEventNewLabel')
            {
                // On ferme le menu
                $('.dropdown-labels').removeClass('is-active');
                $('.button-l').removeClass('dropdown-labels-close');

                $(window).off();
                $('.l-add').off();
                
                $('.dropdown-labels').on('click', app.addEventNewLabel);
                app.lastEventName = undefined;
                app.boolAddClass = false;
            }
    },

    // #######################################################################
    // addDragAndDrop function
    // Méthode permettant de gérer le Drag&Drop sur les cards
    // #######################################################################

    addDragAndDrop: function() {

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
                        url: '/updateCardStatus', 
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
    }
};

$(app.init);