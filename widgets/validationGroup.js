/*globals CQ*/

/**
 * Provides validationGroup xtype
 * Expects xtype="validationGroup"
 * Expects validationSettings attribute
 * Expects single child: <items>, that in turn contains the fields to be validated
 *
 * dialog.xml snippet:
 * <example>
 *     <validationGroup
 *              jcr:primaryType="cq:Widget"
 *              title="Social Networking Links"
 *              xtype="validationGroup"
 *              collapsed="{Boolean}false"
 *              collapsible="{Boolean}false"
 *              validationSettings='"criteria":{"min":1}, "fieldtype":"textfield", "message":"Please enter at least one Social Networking link."'>
 *         <items jcr:primaryType="cq:WidgetCollection">
 *             <twitterLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="Twitter Link"
 *                      name="./twitterLink"
 *                      xtype="textfield"/>
 *             <linkedinLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="LinkedIn Link"
 *                      name="./linkedinLink"
 *                      xtype="textfield"/>
 *             <facebookLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="Facebook Link"
 *                      name="./facebookLink"
 *                      xtype="textfield"/>
 *             <githubLink
 *                      jcr:primaryType="cq:Widget"
 *                      fieldLabel="GitHub Link"
 *                      name="./githubLink"
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
        var dialog = me.findParentByType('dialog');

        Ejst.CustomWidget.superclass.initComponent.call(me);

        // beforesubmit handler
        dialog.on('beforesubmit', function(){
            var isValid = false;
            var options = JSON.parse('{'+(me.validationSettings||'')+'}');
            console.log('validation group :: options : ', options);
            if(!options.criteria){
                return;
            }
            var fields = options.fieldtype ? me.findByType(options.fieldtype) : me.items;
            var fieldToFocus = fields[0];

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

                // todo - would be nice to show this inside the dialog
                CQ.Notification.notify(CQ.I18n.getMessage("Validation Error"),CQ.I18n.getMessage(options.message));

            }

            return isValid;

        });

    }

});

// register xtype
CQ.Ext.reg('validationGroup', Ejst.CustomWidget);
