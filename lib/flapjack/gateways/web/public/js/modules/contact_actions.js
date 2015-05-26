(function(flapjack, ContactActions) {

    flapjack.ActionsView = Backbone.View.extend({
        initialize: function() {
            this.template = _.template($('#contact-actions-template').html());
        },
        tagName: 'div',
        className: 'actions',
        events: {
            "click button#addContact" : "addContact",
        },
        render: function() {
            this.$el.html(this.template({}));
            return this;
        },
        addContact: function() {
            // skip if modal showing
            if ( $('#contactModal').hasClass('in') ) { return; }

            var contact = new (Contact.Model)();
            contact.setPersisted(false);
            contact.set('id', toolbox.generateUUID());

            var contactDetailsView = new (Contact.Views.ContactDetails)({model: contact});
            contactDetailsView.render();

            $('div.modal-dialog').append(contactDetailsView.$el);
            $('#contactModal').modal('show');
        }
    });

    ContactActions.start = function () {
        flapjack['api_url'] = $('div#data-api-url').data('api-url');

        var Contact = flapjack.module("contact");

        var actionsView = new flapjack.ActionsView();

        flapjack.contactList = new Contact.List();

        flapjack.contactList.fetch({
            success: function(collection, response, options) {
                var contactListView = new (Contact.Views.List)({collection: collection});
                contactListView.render();
                $('tbody#contactList').replaceWith(contactListView.$el);

                $('#contactModal').on('hidden.bs.modal', function (e) {
                    e.stopImmediatePropagation();
                    $('div.modal-dialog').empty();
                });

                $('#container').append(actionsView.render().el);
            }
        });
    }

})(flapjack, flapjack.module("contact_actions"));