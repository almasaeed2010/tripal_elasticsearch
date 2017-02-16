/**
 * Created by mingchen on 1/31/17.
 */
(function ($) {
    Drupal.behaviors = Drupal.behaviors || {};

    Drupal.behaviors.indices_delete_confirmation = {
        attach: function (context, settings) {
            $(document).on('click', '#indices-delete-confirmation', function(e) {

                if (confirm("Warning: you can not undo this step!")) {
                }
                else {
                    e.preventDefault();
                }
            });
        }
    }

})(jQuery)