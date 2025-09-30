// Count Widget for Dashboard - Events of the day
function dashboard_widget_countEventsDay(value = null){
    var container = $(document.createElement('div'));
    var conditions = [
        {key: 'created', operator: '>', value: moment().subtract(1, 'days').format('YYYY-MM-DD')},
    ];
    if(value && value !== 'All'){
        conditions.push({key: 'owner', operator: '=', value: value});
    }
    builder.Widget(
        'eventsCounter',
        container,
        {
            title: builder.Locale.get('Events today'),
            autoStart:true,
            icon: 'activity',
            color: 'primary',
            conditions: conditions,
        },
    );
    return container;
}
function dashboard_meta_countEventsDay(key = null){
    const metadata = {
        label: "Count events of the day",
        description: "This is a count of all the events of the day.",
        type: "select",
        value: "All",
        options: [
            {id: 'All', text: 'All Events'},
            {id: USER_USERNAME, text: 'My Events only'},
        ],
    };
    return metadata[key] ? metadata[key] : metadata;
}

// Count Widget for Dashboard - Events of the week
function dashboard_widget_countEventsWeek(value = null){
    var container = $(document.createElement('div'));
    var conditions = [
        {key: 'created', operator: '>', value: moment().subtract(7, 'days').format('YYYY-MM-DD')},
    ];
    if(value && value !== 'All'){
        conditions.push({key: 'owner', operator: '=', value: value});
    }
    builder.Widget(
        'eventsCounter',
        container,
        {
            title: builder.Locale.get('Events this week'),
            autoStart:true,
            icon: 'activity',
            color: 'primary',
            conditions: conditions,
        },
    );
    return container;
}
function dashboard_meta_countEventsWeek(key = null){
    const metadata = {
        label: "Count events of the week",
        description: "This is a count of all the events of the week.",
        type: "select",
        value: "All",
        options: [
            {id: 'All', text: 'All Events'},
            {id: USER_USERNAME, text: 'My Events only'},
        ],
    };
    return metadata[key] ? metadata[key] : metadata;
}

// Count Widget for Dashboard - Events of the month
function dashboard_widget_countEventsMonth(value = null){
    var container = $(document.createElement('div'));
    var conditions = [
        {key: 'created', operator: '>', value: moment().subtract(30, 'days').format('YYYY-MM-DD')},
    ];
    if(value && value !== 'All'){
        conditions.push({key: 'owner', operator: '=', value: value});
    }
    builder.Widget(
        'eventsCounter',
        container,
        {
            title: builder.Locale.get('Events this month'),
            autoStart:true,
            icon: 'activity',
            color: 'primary',
            conditions: conditions,
        },
    );
    return container;
}
function dashboard_meta_countEventsMonth(key = null){
    const metadata = {
        label: "Count events of the month",
        description: "This is a count of all the events of the month.",
        type: "select",
        value: "All",
        options: [
            {id: 'All', text: 'All Events'},
            {id: USER_USERNAME, text: 'My Events only'},
        ],
    };
    return metadata[key] ? metadata[key] : metadata;
}

// Count Widget for Dashboard - Events of the year
function dashboard_widget_countEventsYear(value = null){
    var container = $(document.createElement('div'));
    var conditions = [
        {key: 'created', operator: '>', value: moment().subtract(365, 'days').format('YYYY-MM-DD')},
    ];
    if(value && value !== 'All'){
        conditions.push({key: 'owner', operator: '=', value: value});
    }
    builder.Widget(
        'eventsCounter',
        container,
        {
            title: builder.Locale.get('Events this year'),
            autoStart:true,
            icon: 'activity',
            color: 'primary',
            conditions: conditions,
        },
    );
    return container;
}
function dashboard_meta_countEventsYear(key = null){
    const metadata = {
        label: "Count events of the year",
        description: "This is a count of all the events of the year.",
        type: "select",
        value: "All",
        options: [
            {id: 'All', text: 'All Events'},
            {id: USER_USERNAME, text: 'My Events only'},
        ],
    };
    return metadata[key] ? metadata[key] : metadata;
}
