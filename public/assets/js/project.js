let app = {

    init: function() {

    let quickviews = bulmaQuickview.attach(); // quickview
    let width;
    let cardID;

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
    let id = pathname[pathname.length-1]
    window.location.href="http://127.0.0.1:8001/p/" + id + "?t=" + statusType; 
    });

    // Préparation drag & drop
    let currentStatusOnPage = $('body').find('p.panel-heading').attr('s-type')
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').addClass('t')
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('task')
    $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('p.heading').prepend('<i class="fas fa-arrow-right mr-1"></i>')

    $(".show-card").draggable({
        start: function( event, ui ) {
            app.width = $(this).width();
            app.cardID = $(this).attr('card-id');
            $(this).addClass('currentDrag')
            $(this).width(50)
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').addClass('background-is-red')
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('task')
        },
        revert : function(event , ui) {
            $(this).width(app.width);
            $(this).removeClass('currentDrag')
            $('body').find('.column[s-type="' + currentStatusOnPage + '"]').removeClass('background-is-red')

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
            
            let status = $(this).closest('div.column').attr('s-type')
            idCard = app.cardID

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
                $('body').find('.currentDrag').remove()
                // Incrémentation compteur destination
                let total = parseInt($(this).find('.title').text());
                total = total + 1;
                $(this).find('.title').html(total)

                // Décrémentation compteur tâche courante
                total = $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('.title').text()
                total = total - 1;
                $('body').find('.column[s-type="' + currentStatusOnPage + '"]').find('.title').html(total)

                $(this).css("border", "none")
            }

            },
        over: function(event, ui) {
            $(this).css("border", "5px solid #fff");
            },
        out: function(event, ui) {
            $(this).css("border", "none")
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
                        + '<div class="modal-card">'
                        +   '<header class="modal-card-head">'
                        +      '<p class="modal-card-title">' + response[0].name + '</p>'
                        +      '<button class="delete close" aria-label="close"></button>'
                        +   '</header>'
                        +   '<section class="modal-card-body">'
                        +      response[0].description
                        +   '</section>'
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
                     }
        
                    }).fail(function() {
                        //$('.result-search-content').html('Erreur de chargement');
                    });
    }
};

$(app.init);