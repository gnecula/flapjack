(function(flapjack, MassChecks) {
    // Shorthands
    // The application container
    var app = flapjack.app;

    var decommission_checks_form_template = null;
    var acknowledge_checks_form_template = null;
    var unacknowledge_checks_form_template = null;
    var schedule_maintenance_checks_form_template = null;
    var unschedule_maintenance_checks_form_template = null;

    // In order to implement the shift-click, we remember the last selector clicked
    var last_check_selector_clicked = null;

    MassChecks.start = function () {
        decommission_checks_form_template = _.template($('#decommission-checks-form-template').html());
        $('#mass-check-actions .decommission-checks').on('click', click_decommission_checks);

        acknowledge_checks_form_template = _.template($('#acknowledge-checks-form-template').html());
        $('#mass-check-actions .acknowledge-checks').on('click', click_acknowledge_checks);

        unacknowledge_checks_form_template = _.template($('#unacknowledge-checks-form-template').html());
        $('#mass-check-actions .unacknowledge-checks').on('click', click_unacknowledge_checks);

        schedule_maintenance_checks_form_template = _.template($('#schedule-maintenance-checks-form-template').html());
        $('#mass-check-actions .schedule-maintenance-checks').on('click', click_schedule_maintenance_checks);

        unschedule_maintenance_checks_form_template = _.template($('#unschedule-maintenance-checks-form-template').html());
        $('#mass-check-actions .unschedule-maintenance-checks').on('click', click_unschedule_maintenance_checks);


        $('#checks-table').on('click', '.check-selector', function (e) {
            if (e.shiftKey && last_check_selector_clicked) {
                var visible_checkboxes = get_check_selectors(':visible');
                var start_range = visible_checkboxes.index(this);
                var end_range = visible_checkboxes.index(last_check_selector_clicked);
                if (end_range >= 0) {
                    // Make the whole range have the state of the last_checked
                    var range = visible_checkboxes.slice(Math.min(start_range, end_range),
                                                         Math.max(start_range, end_range) + 1).prop('checked', last_check_selector_clicked.prop('checked'));
                }
            }
            last_check_selector_clicked = $(this);
        });
        $('#checks-table .select-all').on('click', function () {
            // Select all visible
            get_check_selectors(':visible').prop('checked', true);
        });
        $('#checks-table .select-none').on('click', function () {
            //  Deselect all
            get_check_selectors().prop('checked', false);
        });
        $('#checks-table').bind('filterEnd', function () {
            // Finished filtering the table
            // De-select the hidden
            get_check_selectors(':hidden').prop('checked', false);
        });

    };


    /**
     * Get the check-selectors, with optional filter selector
     * @param extraSelector : string - extra JQuery selector (:visible, or :visible:checked)
     */
    function get_check_selectors(extraSelector) {
        if(! extraSelector) {
            extraSelector = '';
        }
        return $('#checks-table .check-selector'+extraSelector);
    }

    /**
     * Get the list of entity/checks corresponding to the
     * checkboxes
     * @param extraSelector
     */
    function get_entity_checks(extraSelector) {
        var selected_checkboxes = get_check_selectors(extraSelector);
        var entity_check_list = _.map(selected_checkboxes, function (chk) { return $(chk).attr('for_entity_check')});

        return entity_check_list;
    }

    // Clicked the Decomission Checks button
    function click_decommission_checks() {
        // Comma-separated list of entity:check to decomission
        var entity_checks = get_entity_checks(':visible:checked');

        if(entity_checks.length == 0) {
            alert('No checks are selected');
            return;
        }
        $('#mass-check-expand').html(decommission_checks_form_template({'entity_checks' : entity_checks.join(',') }));
        // Submit the form
        $('#mass-check-expand form').submit();
    }


    // Clicked the Acknowledge Checks button
    function click_acknowledge_checks() {
        // Find all the selected checks, that are visible, and are not in Ok status
        var entity_checks = get_entity_checks(":visible:checked[status!='ok']");
        if(entity_checks.length == 0) {
            alert('No failing, unacknowledged, checks are selected');
            return;
        }
        $('#mass-check-expand').html(acknowledge_checks_form_template({'entity_checks' : entity_checks.join(',') }));
    }

    // Clicked the Unacknowledge Checks button
    function click_unacknowledge_checks() {
        // Find all the selected checks, that are visible, and are acknowledged
        var entity_checks = get_entity_checks(":visible:checked[acknowledgement_id!='']");
        if(entity_checks.length == 0) {
            alert('No acknowledged checks are selected');
            return;
        }
        $('#mass-check-expand').html(unacknowledge_checks_form_template({'entity_checks' : entity_checks.join(',') }));
        $('#mass-check-expand form').submit();
    }


    // Clicked the Schedule maintenance Checks button
    function click_schedule_maintenance_checks() {
        // Find all the selected checks, that are visible
        var entity_checks = get_entity_checks(":visible:checked");
        if(entity_checks.length == 0) {
            alert('No checks are selected');
            return;
        }
        $('#mass-check-expand').html(schedule_maintenance_checks_form_template({'entity_checks' : entity_checks.join(',') }));
    }

    function click_unschedule_maintenance_checks() {
        // Find all the selected checks, that are visible, and are in scheduled maintenance
        var selected_checkboxes = get_check_selectors(":visible:checked[scheduled_maintenance_start!='']");
        var entity_check_start_list = _.map(selected_checkboxes, function (chk) { return $(chk).attr('for_entity_check')+":"+$(chk).attr('scheduled_maintenance_start') });

        if(entity_check_start_list.length == 0) {
            alert('No checks currently in scheduled maintenance are selected');
            return;
        }
        $('#mass-check-expand').html(unschedule_maintenance_checks_form_template({'entity_check_starts' : entity_check_start_list.join(',') }));
        $('#mass-check-expand form').submit();
    }


})(flapjack, flapjack.module("mass_checks"));
