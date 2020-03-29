let app = {
    // #######################################################################
    // init function
    // #######################################################################
    init: function() {

    let quickviews = bulmaQuickview.attach(); // quickview
    let width;

    $("#modal").click(function() {
    $(".modal").addClass("is-active");  
    });

    $(".close").click(function() {
    $(".modal").removeClass("is-active");
    });

    $(".modal-background").click(function() {
        $(".modal").remove();
    });

    $(".task").click(function() {
    let statusType = jQuery(this).attr("s-type");
    let pathname = window.location.pathname.split("/");
    let id = pathname[pathname.length-1]
    window.location.href="http://127.0.0.1:8001/p/" + id + "?t=" + statusType; 
    });

    $(".show-card").draggable({
        revert : function(event , ui) {
            $(this).width(app.width);
        if(event) {
            return event;
        }
        else
            return !event;
            
        },
        start: function( event, ui ) {
            app.width = $(this).width();
            console.log(width);
            $(this).width(50);
        }
    });

    $(".task").droppable({
        valid: '.task',
        drop: function(event, ui) {
            //$(this).css('background', 'rgb(0,200,0)');
            let total = parseInt($(this).find('.title').text());
            total = total + 1;
            $(this).find('.title').html(total)
            },
        over: function(event, ui) {
            $(this).css("border", "2px solid #fff");
            console.log($(this).closest('div.column').attr('s-type'))
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