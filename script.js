// Register dashboard widgets only if dashboard is defined
if(typeof dashboard !== "undefined"){

    // Register - Event Counter Widget
    // A simple counter widget for the dashboard to count events based on conditions
    // by default it counts all events, but can be filtered by owner or other conditions
    dashboard.add('counter-events', class extends dashboard.Widget {
        _init(){
            this._properties = {
                name: "counter-events",
                label: "Event Counter",
                description: "A simple counter widget to count events based on conditions.",
                minSize: 1,
                maxSize: 12,
                interval: 10000,
                autoStart: true,
            };
            this._options = {
                title: this._options.title || this._properties.label,
                timeframe: this._options.timeframe || 'day', // day, week, month, year
                owner: this._options.owner || 'all', // All, or specific username
                icon: this._options.icon || 'activity',
                color: this._options.color || 'primary',
            };
            this._badge = null;
        }

        conditions(){
            const conditions = [];
            switch(this._options.timeframe){
                case 'day':
                    conditions.push({key: 'created', operator: '>', value: moment().subtract(1, 'days').format('YYYY-MM-DD')});
                    break;
                case 'week':
                    conditions.push({key: 'created', operator: '>', value: moment().subtract(7, 'days').format('YYYY-MM-DD')});
                    break;
                case 'month':
                    conditions.push({key: 'created', operator: '>', value: moment().subtract(30, 'days').format('YYYY-MM-DD')});
                    break;
                case 'year':
                    conditions.push({key: 'created', operator: '>', value: moment().subtract(365, 'days').format('YYYY-MM-DD')});
                    break;
            }
            if(this._options.owner && this._options.owner !== 'all'){
                conditions.push({key: 'owner', operator: '=', value: this._options.owner});
            }
            return conditions;
        }

        title(){
            switch(this._options.timeframe){
                case 'day':
                    this._options.title = 'Events today';
                    break;
                case 'week':
                    this._options.title = 'Events this week';
                    break;
                case 'month':
                    this._options.title = 'Events this month';
                    break;
                case 'year':
                    this._options.title = 'Events this year';
                    break;
            }
            switch(this._options.owner){
                case 'all':
                    break;
                default:
                    this._options.title = 'My ' + this._options.title.toLowerCase();
                    break;
            }
            return this._options.title;
        }

        _create(){
            const self = this;

            // Create the Badge
            this._builder.Component(
                "badge",
                this._component.gadget,
                {
                    icon: this._options.icon,
                    color: this._options.color,
                },
                function(badge,component){

                    // Set the badge
                    self._badge = badge;

                    // Set Content
                    component.label = $(document.createElement("h5")).addClass("m-0").text(self._builder.Locale.get(self.title())).appendTo(component.content);
                    component.count = $(document.createElement("p")).addClass("m-0").text(0).appendTo(component.content);
                },
            );
        }

        _load(){
            const self = this;
            API.endpoint('/event/count').data({conditions: this.conditions()}).execute(function(response){
                self.load(response.count);
            });
        }

        _render(){
            if(this._badge){
                this._badge._component.label.text(this._builder.Locale.get(this.title()));
                this._badge._component.count.text(this._data !== null ? this._data : '0');
                this._badge._component.iconFrame.attr('class','d-flex justify-content-center align-items-center rounded text-bg-'+this._options.color);
                this._badge._component.icon.attr('class','fs-3 bi bi-'+this._options.icon);
            }
        }

        _config(form){

            // timeframe
            form.add(
                'select',
                {
                    name: 'timeframe',
                    label: this._builder.Locale.get('Timeframe'),
                    placeholder: this._builder.Locale.get('Select a timeframe'),
                    options: [
                        {id: 'day', text: this._builder.Locale.get('Events today')},
                        {id: 'week', text: this._builder.Locale.get('Events this week')},
                        {id: 'month', text: this._builder.Locale.get('Events this month')},
                        {id: 'year', text: this._builder.Locale.get('Events this year')},
                    ],
                    value: this._options.timeframe,
                    class: {
                        component: 'bg-gray-200 p-3 py-2 rounded-0',
                    },
                }
            );

            // owner
            form.add(
                'select',
                {
                    name: 'owner',
                    label: this._builder.Locale.get('Owner'),
                    placeholder: this._builder.Locale.get('Select an owner'),
                    options: [
                        {id: 'all', text: this._builder.Locale.get('All Events')},
                        {id: USER_USERNAME, text: this._builder.Locale.get('My Events only')},
                    ],
                    value: this._options.owner,
                    class: {
                        component: 'bg-gray-200 p-3 py-2 rounded-0',
                    },
                }
            );

            // color
            form.add(
                'select2',
                {
                    name: 'color',
                    label: this._builder.Locale.get('Color'),
                    placeholder: this._builder.Locale.get('Select a color'),
                    options: this.colors(),
                    value: this._options.color,
                    class: {
                        component: 'bg-gray-200 p-3 py-2 rounded-0',
                    },
                    callback:{
                        format: function(option, component){
                            if (!option.id) { return option.text; }
                            return $('<div class="px-3 py-2 animate-flicker-hover text-bg-' +  option.element.value.toLowerCase() + '" style="margin: -.375rem -.75rem!important;">' + option.text + '</div>');;
                        },
                    },
                }
            );

            // icon
            form.add(
                'select2',
                {
                    name: 'icon',
                    label: this._builder.Locale.get('Icon'),
                    placeholder: this._builder.Locale.get('Select an icon'),
                    options: this.icons(),
                    value: this._options.icon,
                    class: {
                        component: 'bg-gray-200 p-3 py-2 rounded-0',
                    },
                    callback:{
                        format: function(option, component){
                            if (!option.id) { return option.text; }
                            return $('<span class=""><i class="me-2 text-bg-light p-1 fs-4 rounded bi bi-' +  option.element.value.toLowerCase() + '"></i>' + option.text + '</span>');
                        },
                    },
                }
            );
        }
    });
}
