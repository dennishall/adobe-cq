/*globals CQ*/

/**
 * Provides validationGroup xtype
 *
 * dialog.xml
 * Expects validationSettings attribute
 * Expects single child: <items>...</items>, that in turn contains the fields to be validated
 * Error Message is supplied by an item with attribute isValidationErrorMessage="yes"
 * Fields to Validate are flagged by adding attribute checkValidity="yes"
 *
 * dialog.xml snippet:
 * <example>
 *     <validationGroup
 *              jcr:primaryType="cq:Widget"
 *              title="Social Networking Links"
 *              xtype="validationGroup"
 *              collapsed="{Boolean}false"
 *              collapsible="{Boolean}false"
 *              validationSettings='"criteria":{"min":1}'>
 *         <items jcr:primaryType="cq:WidgetCollection">
 *             <static
 *                      jcr:primaryType="cq:Widget"
 *                      isValidationErrorMessage="yes"
 *                      xtype="static"
 *                      style="color:red; margin:0 0 10px;"
 *                      text="Please enter at least one Social Networking link."/>
 *             <twitterLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="Twitter Link"
 *                      name="./twitterLink"
 *                      checkValidity="yes"
 *                      xtype="textfield"/>
 *             <linkedinLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="LinkedIn Link"
 *                      name="./linkedinLink"
 *                      checkValidity="yes"
 *                      xtype="textfield"/>
 *             <facebookLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="Facebook Link"
 *                      name="./facebookLink"
 *                      checkValidity="yes"
 *                      xtype="textfield"/>
 *             <githubLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="GitHub Link"
 *                      name="./githubLink"
 *                      checkValidity="yes"
 *                      xtype="textfield"/>
 *         </items>
 *     </validationGroup>
 * </example>
 */


var Ejst = window.Ejst || {};
Ejst.CustomWidget = CQ.Ext.extend(CQ.form.DialogFieldSet, {

    constructor: function(config) {
        "use strict";
        config = CQ.Util.applyDefaults(config || {}, {});
        Ejst.CustomWidget.superclass.constructor.call(this, config);
    },

    // overriding CQ.Ext.Component#initComponent
    initComponent: function() {
        "use strict";


        var me = this;

        Ejst.CustomWidget.superclass.initComponent.call(me);

        var options = JSON.parse('{'+(me.validationSettings||'')+'}');

        if(!options.criteria){
            return;
        }

        var errorMessageElement = me.find('isValidationErrorMessage', 'yes')[0];
        errorMessageElement.hide();

        // beforesubmit handler - do the validation
        me.findParentByType('dialog').on('beforesubmit', function(){
            var isValid = false;
            var fields = me.find('checkValidity', 'yes');

            console.log('fields', fields);

            // anticipating other validation types, may need to update this reference during validation processing
            var fieldToFocus = fields[0];

            errorMessageElement.hide();

            for(var i = 0, l = fields.length; i < l; i++){
                var field = fields[i];
                var value = field.getValue();

                // process validation type

                // currently, only "min":1 is supported
                if(options.criteria.min === 1 && value){
                    // group is valid, remove error message for it
                    isValid = true;
                }

                // todo - add logic for other validation types

            }

            if(!isValid){

                // bring focus to the field that needs correct user input
                fieldToFocus.focus();
                errorMessageElement.show();

            }

            return isValid;

        });

    }

});

// register xtype
CQ.Ext.reg('validationGroup', Ejst.CustomWidget);
