builder.add('widgets','events', class extends builder.ComponentClass {

    _init(){
        this._properties = {
            class: {
                component: null,
            },
            data: {},
            targetTable: null,
            targetId: null,
            interval: 10000,
            autoStart: false,
            callback: {},
        };
        this._timeline = null;
        this._events = {};
        this._counter = 0;
        this._interval = null;
    }

    _create(){

        // Set Self
        const self = this;

        // Create Component
        this._component = $(document.createElement('div')).attr({
            'id': 'events' + this._id,
            'class': 'events-feed',
        });
        this._component.id = this._component.attr('id');

        // Set Component Class
        if(this._properties.class.component){
            this._component.addClass(this._properties.class.component);
        }

        // Create a controls container
        this._component.controls = $(document.createElement('div')).addClass('events-controls').prependTo(this._component);

        // // Create view controls
        // this._component.controls.group = $(document.createElement('div')).addClass('btn-group').appendTo(this._component.controls);
        // this._component.controls.group.grid = $(document.createElement('button')).attr({
        //     'class': 'btn btn-outline-secondary',
        //     'data-action': 'grid',
        //     'type': 'button',
        // }).html('<i class="bi bi-grid-3x3-gap"></i>').appendTo(this._component.controls.group);
        // this._component.controls.group.list = $(document.createElement('button')).attr({
        //     'class': 'btn btn-outline-secondary',
        //     'data-action': 'list',
        //     'type': 'button',
        // }).html('<i class="bi bi-list"></i>').appendTo(this._component.controls.group);

        // // Create a search container
        // this._component.search = $(document.createElement('input')).attr({
        //     'class': 'form-control',
        //     'type': 'search',
        //     'placeholder': this._builder.Locale.get('Search...'),
        // }).prependTo(this._component.controls);
        // this._component.search.on('input', function(){
        //     const search = this.value.toLowerCase();
        //     self._component.container.children('.col').each(function(){
        //         const content = $(this).text().toLowerCase();
        //         if(content.includes(search)){
        //             $(this).show();
        //         } else {
        //             $(this).hide();
        //         }
        //     });
        // });

        // // Create a container for the related
        // this._component.container = $(document.createElement('div')).addClass('related-container').appendTo(this._component);
        // this._component.container.on('click', '.controls, .controls *', function (e) {
        //     e.stopPropagation();
        // });

        // // Load the state
        // this.loadState();

        // // Add Event Listeners
        // this._component.controls.group.grid.click(function(){

        //     // Set the grid view
        //     self._component.container.removeClass('list-view').addClass('grid-view');
        //     self._component.controls.group.grid.addClass('active');
        //     self._component.controls.group.list.removeClass('active');

        //     // Save the state
        //     self.saveState();
        // });
        // this._component.controls.group.list.click(function(){

        //     // Set the list view
        //     self._component.container.removeClass('grid-view').addClass('list-view');
        //     self._component.controls.group.list.addClass('active');
        //     self._component.controls.group.grid.removeClass('active');

        //     // Save the state
        //     self.saveState();
        // });

        // Create a timeline
        this._builder.Component(
            "timeline",
            this._component,
            {
                class: {
                    component: 'pe-3',
                    // item: "border rounded",
                },
            },
            function(timeline,component){

                // Set the timeline
                self.timeline(timeline);

                // Styling
                component.filters.appendTo(self._component.controls);

                // Add existing Records
                self.load(self._properties.data ?? {});

                // Check if autoStart is enabled
                if(self._properties.autoStart){

                    // Start the interval to check for changes
                    setTimeout(function(){
                        self.start();
                    }, self._properties.interval);
                }
            }
        );
    }

    timeline(timeline = null){
        if(timeline){
            this._timeline = timeline;
        }
        return this._timeline;
    }

    stateKey() {

        // include origin, path and query so /page?a=1 and /page?a=2 don't clash
        const url = location.origin + location.pathname + location.search;
        return `files.state::${url}::${this._component.id}`;
    }

    clearState() {

        // Remove persisted state
        localStorage.removeItem(this.stateKey());

        // Reset the view mode
        this._component.container.removeClass('list-view').addClass('grid-view');
    }

    saveState() {

        // Save the current view mode
        const state = {
            view: this._component.container.hasClass('list-view') ? 'list' : 'grid',
        };

        // Persist the state
        localStorage.setItem(this.stateKey(), JSON.stringify(state));
    }

    loadState() {

        // Check for persisted state
        const state = localStorage.getItem(this.stateKey());
        if(state){
            try {
                const parsedState = JSON.parse(state);
                if(parsedState.view === 'list'){
                    // Set the list view
                    this._component.container.removeClass('grid-view').addClass('list-view');
                    this._component.controls.group.list.addClass('active');
                    this._component.controls.group.grid.removeClass('active');
                } else {
                    // Set the grid view
                    this._component.container.removeClass('list-view').addClass('grid-view');
                    this._component.controls.group.grid.addClass('active');
                    this._component.controls.group.list.removeClass('active');
                }
            } catch (e) {
                // If parsing fails, default to grid view
                this._component.container.removeClass('list-view').addClass('grid-view');
                this._component.controls.group.grid.addClass('active');
                this._component.controls.group.list.removeClass('active');
            }
        } else {
            // Default to grid view if no state is found
            this._component.container.removeClass('list-view').addClass('grid-view');
            this._component.controls.group.grid.addClass('active');
            this._component.controls.group.list.removeClass('active');
        }
    }

    load(records = null){

        // Set Self
        const self = this;

        // Check if records are provided
        if(records !== null && Object.entries(records).length > 0){

            // Loop through the records
            for(const [id, record] of Object.entries(records)){
                self.add(record);
            }
            return this;
        }

        // Retrieve Records
        $.ajax({
            url: '/api/event/fetchAll',
            headers: {'X-CSRF-Authorization': CSRF_KEY},
            type: 'POST',dataType: 'json',
            data: {
                conditions: [
                    {key: 'targetTable', operator: '=', value: this._properties.targetTable},
                    {key: 'targetId', operator: '=', value: this._properties.targetId},
                    {key: 'isArchived', operator: '<>', value: 1},
                ]
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
                reject(error);
            },
            success: function(response) {

                // Add Records
                for(const [key, record] of Object.entries(response.records)){
                    self.add(record);
                }
            }
        });

        return this;
    }

    start(){
        // Set Self
        const self = this;

        // Check if the interval is already set
        if(this._interval){
            console.warn('Interval is already set, stopping the previous one.');
            clearInterval(this._interval);
        }

        // Set the interval to check for changes
        this._interval = setInterval(function(){
            self.load();
        }, this._properties.interval);
    }

    stop(){
        // Check if the interval is set
        if(this._interval){
            clearInterval(this._interval);
            this._interval = null;
        } else {
            console.warn('No interval is currently set.');
        }
    }

    add(record, param1 = null, param2 = null){

        // Set Self
        const self = this;

        let options = {};
        let callback = null;

        // Set selector, options, and callback
        [param1, param2].forEach(param => {
            if(param !== null){
                if (typeof param === 'object') {
                    options = param;
                } else if (typeof param === 'function') {
                    callback = param;
                }
            }
        });

        let properties = {
            class: {},
            callback: {},
        };

        // Configure Options
        for(const [key, value] of Object.entries(options)){
            if(typeof properties[key] !== 'undefined'){
                switch(key){
                    case"callback":
                        if(typeof properties[key] !== 'undefined'){
                            for(const [k, v] of Object.entries(value)){
                                if(typeof properties[key][k] !== 'undefined'){
                                    properties[key][k] = v;
                                }
                            }
                        }
                        break;
                    case"class":
                        for(const [section, classes] of Object.entries(value)){
                            if(properties[key][section] != null){
                                properties[key][section] += ' ' + classes;
                            } else {
                                properties[key][section] = classes;
                            }
                        }
                        break;
                    default:
                        properties[key] = value;
                        break;
                }
            }
        }

        // Check if the file already exists
        if(this._events[record.id ?? (this._counter + 1)]){
            return this;
        }

        // Increment Post Count
        this._counter++;

        // Set ID
        const count = record.id ?? this._counter;
        const id = this._component.id + 'event' + count;

        // Add the activity to the timeline
        this.timeline().add(
            {
                icon: record.icon,
                color: record.color,
                datetime: record.created,
                type: record.category,
            },
            function(object){

                // Set the data
                object.data = record;

                // Style the item card
                object.time.addClass('cursor-default');

                // Set Content
                object.owner = $(document.createElement("span")).addClass('cursor-pointer event-owner').html('<i class="me-1 bi bi-person"></i>'+record.owner.username).prependTo(object.tools);
                object.owner.click(function(){
                    self._builder.Widget('vcard',{data: record.owner.vcard});
                });
                object.delete = $(document.createElement("button")).attr({
                    'type': 'button',
                    'class': 'btn btn-sm btn-link text-decoration-none',
                }).html('<i class="bi me-1 bi-trash"></i>'+self._builder.Locale.get('Delete')).prependTo(object.tools);
                object.delete.click(function(){
                    self.delete(count);
                });
                object.content = $(document.createElement("div")).addClass("item-content").appendTo(object.item);
                object.content.h5 = $(document.createElement("h5")).html(self._builder.Parser.parse(record.message)).appendTo(object.content);

                // Save the item
                self._events[count] = object;
            },
        );

        // return the instance
        return this;
    }

    delete(id){

        // Set Self
        const self = this;

        // Check if the event exists
        if(!this._events[id]){
            console.warn('Event with ID', id, 'does not exist.');
            return this;
        }

        // Create the Modal
        this._builder.Component(
            "modal",
            {
                icon: "trash",
                title: this._builder.Locale.get("Are you sure?"),
                body: this._builder.Locale.get("You are about to delete this event. Are you sure you want to continue?"),
                color: 'danger',
                callback: {
                    submit: function(element,modal){

                        // Show the modal spinner
                        modal.spinner(true);

                        // AJAX Request - Delete the event
                        $.ajax({
                            url: '/api/event/delete?id='+id,
                            type: 'GET',dataType: 'json',
                            error: function(xhr, status, error) {
                                console.error('Error deleting event:', error);
                                modal.hide();
                            },
                            success: function(response) {

                                // Remove the event from the timeline
                                self._events[id].remove();
                                delete self._events[id];

                                // Close the modal
                                modal.hide();
                            }
                        });
                    },
                },
            },
            function(modal,component){

                // Show the modal
                modal.show();
            },
        );
    }
});
