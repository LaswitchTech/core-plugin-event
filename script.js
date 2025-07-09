// Events
const EventFeed = function(activities, container){
    builder.Component(
        "timeline",
        container,
        {
            class: {
                item: "border rounded",
            },
        },
        function(timeline,component){

            // Loop through the activities
            for(const [key, activity] of Object.entries(activities)){

                // Add the activity to the timeline
                timeline.add(
                    {
                        icon: activity.icon,
                        color: activity.color,
                        datetime: activity.created,
                        type: activity.category,
                    },
                    function(object,timeline){

                        // Style the time
                        object.time.attr({
                            'class': 'btn btn-sm btn-secondary',
                            'style': 'font-size: 12px',
                        });

                        // Style the item card
                        object.item.addClass('card');

                        // Set Content
                        var header = $(document.createElement("div")).addClass("card-header border-0").appendTo(object.item);
                        header.h5 = $(document.createElement("h5")).addClass("card-title").html(builder.Parser.parse(activity.message)).appendTo(header);
                        header.h5.find('[data-vcard]').off().click(function(){
                            vCardModal($(this).attr('data-vcard'),$(this).attr('data-vcard-name'));
                        });
                    },
                );
            }
        },
    );
}
