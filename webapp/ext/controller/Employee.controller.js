// sap.ui.define([
//     'sap/ui/core/mvc/Controller',
//     'sap/ui/core/IconPool',
//     'sap/ui/model/json/JSONModel',
//     'sap/m/Link',
//     'sap/m/MessageItem',
//     'sap/m/MessageView',
//     'sap/m/Button',
//     'sap/m/Dialog',
//     'sap/m/Bar',
//     'sap/m/Text',
//     "sap/ui/base/ManagedObject",
//     "sap/ui/core/Fragment"

// ], function (Controller, IconPool, JSONModel, Link, MessageItem, MessageView, Button, Dialog, Bar, Text, ManagedObject, Fragment) {
//     "use strict";
//     return ManagedObject.extend("com.touchette.unconfirmedorders.ext.controller.Employee", {
// 		constructor : function (oView) {
// 			this._oView = oView;
// 		},
// 		exit : function () {
// 			delete this._oView;
// 		},
// 		open : function () {
// 			var oView = this._oView;

// 			// create dialog lazily
// 			if (!this.pDialog) {
// 				var oFragmentController = {
//                     onPressCancel: function (oEvent) {
//                         oView.byId("Employee").close();
//                     },
//                     onPressSave: function (oEvent) {
//                         oView.byId("Employee").close();
//                     }
// 				};
// 				// load asynchronous XML fragment
// 				this.pDialog = Fragment.load({
// 					id: oView.getId(),
// 					name: "sap.ui.demo.walkthrough.view.HelloDialog",
// 					controller: oFragmentController
// 				}).then(function (oDialog) {
// 					// connect dialog to the root view of this component (models, lifecycle)
// 					oView.addDependent(oDialog);
// 					return oDialog;
// 				});
// 			}
// 			this.pDialog.then(function(oDialog) {
// 				oDialog.open();
// 			});
// 		}

// 	});
// })

// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageToast"
// ], function (Controller, MessageToast) {
//     "use strict";

//     return Controller.extend("com.touchette.unconfirmedorders.ext.controller.Employee", {

//         onShowHello: function () {
//             // read msg from i18n model
//             var oBundle = this.getView().getModel("i18n").getResourceBundle();
//             var sRecipient = this.getView().getModel().getProperty("/recipient/name");
//             var sMsg = oBundle.getText("helloMsg", [sRecipient]);

//             // show message
//             MessageToast.show(sMsg);
//         },

//         onOpenDialog: function () {
//             var oView = this.getView();
//             var oDialog = oView.byId("helloDialog");
//             // create dialog lazily
//             if (!oDialog) {
//                 // create dialog via fragment factory
//                 oDialog = sap.ui.xmlfragment(oView.getId(), "com.touchette.unconfirmedorders.ext.view.Employee", this);
//                 // connect dialog to view (models, lifecycle)
//                 oView.addDependent(oDialog);
//             }

//             oDialog.open();
//         },

//         onCloseDialog: function () {
//             this.byId("helloDialog").close();
//         },

//         onPressSave1: function (oEvent) {
//             this.byId("helloDialog").close();
//             //oView.byId("helloDialog").close();
//         },
//     });

// });