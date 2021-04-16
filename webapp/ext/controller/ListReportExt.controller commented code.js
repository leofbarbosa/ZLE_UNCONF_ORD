// sap.ui.define([
//   'sap/ui/core/mvc/Controller',
//   'sap/ui/core/IconPool',
//   'sap/ui/model/json/JSONModel',
//   'sap/m/Link',
//   'sap/m/MessageItem',
//   'sap/m/MessageView',
//   'sap/m/Button',
//   'sap/m/Dialog',
//   'sap/m/Bar',
//   'sap/m/Text'
// ], function (Controller, IconPool, JSONModel, Link, MessageItem, MessageView, Button, Dialog, Bar, Text) {
//   "use strict";

//   sap.ui.controller("com.touchette.unconfirmedorders.ext.controller.ListReportExt", {

//     onInit: function () {
//       this.getOwnerComponent().getModel("sourcConfig").setData({
//         InventoryVisibility: "N",
//         WaiveShippingFlag: false,
//         AcceptSaturdayFlag: true
//       });
//     },

//     onRelease: function (oEvent) {
//       //sap.m.MessageToast.show("Release");

//       var oTable = this.getOwnerComponent().getModel();
//       var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
//       if (oSel.length == 0) {
//         sap.m.MessageToast.show("Select a line");
//       } else {
//         var len = oSel[0].mAggregations.cells.length;
//         for (let i = 0; i < len; i++) {
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderNumber") {
//             var vVbeln = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderItem") {
//             var vPosnr = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "SchedLine") {
//             var vEtenr = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//         }

//         var dialog = new sap.m.Dialog('dialog', {
//           title: 'Confirm Diff Price Release',
//           type: 'Message',
//           contentWidth: '400px',
//           content: [
//             new sap.ui.layout.form.SimpleForm({
//               editable: true,
//               layout: 'ResponsiveGridLayout',
//               content: [
//                 new sap.m.Label({
//                   text: "Release price diff?"
//                 })
//               ]
//             })
//           ],
//           beginButton: new sap.m.Button({
//             // icon: "sap-icon://accept",
//             // type: "Accept",
//             text: "Release",
//             press: function (oEvent2) {
//               //sap.m.MessageToast.show("Price Diff Released");
//               var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/");

//               oModel.callFunction("/ReleaseItem", {
//                 method: "POST",
//                 urlParameters: {
//                   "OrderNumber": vVbeln,
//                   "OrderItem": vPosnr,
//                   "SchedLine": vEtenr
//                 },
//                 success: fSucess,
//                 error: fError
//               });

//               function fSucess(oData, oResponse) {
//                 sap.m.MessageBox.success("Order: " + vVbeln + " / Item: " + vPosnr + " Released");
//               };
//                 //sap.m.MessageToast.show("Order: " + vVbeln + " /Item: " + vPosnr + " Released");
//               //   var xmlRead = oResponse.headers["sap-message"];
//               //   var parser = new DOMParser();
//               //   var xmldoc = parser.parseFromString(xmlRead, "text/xml");
//               //   var messages = xmldoc.getElementsByTagName("message");
//               //   var types = xmldoc.getElementsByTagName("severity"); // parei aqui
//               //   var len = messages.length;
//               //   var text = new Array();

//               //   var oMessageTemplate = new MessageItem({
//               //     type: '{type}',
//               //     title: '{title}',
//               //     description: '{description}',
//               //     subtitle: '{subtitle}',
//               //     counter: '{counter}',
//               //     markupDescription: '{markupDescription}'
//               //   });
//               //   var msgType;
//               //   var msgMsg;
//               //   for (let i = 0; i < len; i++) {
//               //     msgType = types[i].textContent;
//               //     msgMsg = messages[i].textContent
//               //     text = new MessageItem({
//               //       type: msgType,
//               //       title: msgMsg
//               //     })
//               //     //text[i] = messages[i].textContent;                
//               //   };
//               //   var oModel = new JSONModel();

//               //   oModel.setData(text);

//               //   this.oMessageView = new MessageView({
//               //     showDetailsPageHeader: false,
//               //     itemSelect: function () {
//               //       oBackButton.setVisible(true);
//               //     },
//               //     items: {
//               //       path: "/",
//               //       template: oMessageTemplate
//               //     }
//               //   });

//               //   var oBackButton = new Button({
//               //     icon: IconPool.getIconURI("nav-back"),
//               //     visible: false,
//               //     press: function () {
//               //       that.oMessageView.navigateBack();
//               //       this.setVisible(false);
//               //     }
//               //   });

//               //   this.oMessageView.setModel(oModel);

//               //   this.oDialog = new Dialog({
//               //     resizable: true,
//               //     content: this.oMessageView,
//               //     state: 'Error',
//               //     beginButton: new Button({
//               //       press: function () {
//               //         this.getParent().close();
//               //       },
//               //       text: "Close"
//               //     }),
//               //     customHeader: new Bar({
//               //       contentMiddle: [
//               //         new Text({
//               //           text: "Error"
//               //         })
//               //       ],
//               //       contentLeft: [oBackButton]
//               //     }),
//               //     contentHeight: "50%",
//               //     contentWidth: "50%",
//               //     verticalScrolling: false
//               //   });

//               //   //sap.m.MessageToast.show(text);
//               //   //sap.m.MessageToast.show(oResponse.headers["sap-message"]);
//               // };

//               function fError(oError) {
//                 sap.m.MessageBox.error("Error releasing order: " + vVbeln + " / Item: " + vPosnr);
//                 //sap.m.MessageToast.show("Error releasing order: " + vVbeln + " / Item: " + vPosnr);
//               };
//               oModel.refresh();
//               oTable.refresh();
//               dialog.close();
//             }
//           }),

//           endButton: new sap.m.Button({
//             // icon: "sap-icon://accept",
//             // type: "Accept",
//             text: "Cancel",
//             press: function (oEvent2) {
//               sap.m.MessageToast.show("action cancelled");
//               dialog.close();
//             }
//           }),

//           afterClose: function () {
//             dialog.destroy();
//           }
//         });
//         this.getView().addDependent(dialog);

//         dialog.open();
//       }
//     },

//     onComment: function (oEvent) {
//       //sap.m.MessageToast.show("Comments")

//       var oTable = this.getOwnerComponent().getModel();
//       var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
//       if (oSel.length == 0) {
//         sap.m.MessageToast.show("Select a line");
//       } else {
//         var len = oSel[0].mAggregations.cells.length;
//         for (let i = 0; i < len; i++) {
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderNumber") {
//             var vVbeln = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderItem") {
//             var vPosnr = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "SchedLine") {
//             var vEtenr = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "Employee") {
//             var vPernr = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//           if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "Comments") {
//             var vComm = oSel[0].mAggregations.cells[i].mProperties.text;
//           };
//         }
//         var dialog = new sap.m.Dialog('dialog', {
//           title: 'Enter Value',
//           type: 'Message',
//           contentWidth: '400px',
//           content: [
//             new sap.ui.layout.form.SimpleForm({
//               editable: true,
//               layout: 'ResponsiveGridLayout',
//               content: [
//                 new sap.m.Label({
//                   text: "Employee Responsible"
//                 }),
//                 new sap.m.Input("employee", {
//                   maxLength: 8,
//                   showSuggestion: true,
//                   showValueHelp: true,
//                 }).setValue(vPernr),
//                 new sap.m.Label({
//                   text: "Comments"
//                 }),
//                 new sap.m.Input("comment", {
//                   maxLength: 30,
//                 }).setValue(vComm)
//               ]
//             })
//           ],

//           beginButton: new sap.m.Button({
//             // icon: "sap-icon://accept",
//             // type: "Accept",
//             text: "Save",
//             press: function (oEvent2) {
//               //sap.m.MessageToast.show("Comments saved");
//               var sEmp = sap.ui.getCore().byId("employee");
//               var vEmp = sEmp.getValue();
//               var sCom = sap.ui.getCore().byId("comment");
//               var vCom = sCom.getValue();

//               var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/");
//               oModel.callFunction("/ChangePartner", {
//                 method: "POST",
//                 urlParameters: {
//                   "OrderNumber": vVbeln,
//                   "OrderItem": vPosnr,
//                   "SchedLine": vEtenr,
//                   "pernr": vEmp,
//                   "Comments": vCom
//                 },
//                 success: fSucess,
//                 error: fError
//               });

//               function fSucess(oData, oResponse) {
//                 sap.m.MessageBox.success("Order: " + vVbeln + " changed");
//                 // var xmlRead = oResponse.headers["sap-message"];
//                 // parser = new DOMParser();
//                 // var xmldoc = parser.parseFromString(xmlRead, "text/xml");
//                 // var messages = xmldoc.getElementsByTagName("message");
//                 // var len = messages.length;
//                 // var text = new Array();
//                 // for (let i = 0; i < len; i++) {
//                 //   text[i] = messages[i].textContent;
//                 // }
//                 // sap.m.MessageToast.show(text);
//               };

//               function fError(oError) {
//                 sap.m.MessageBox.error("Error changing order: " + vVbeln);
//               };
//               oModel.refresh();
//               oTable.refresh();
//               dialog.close();
//             }
//           }),
//           endButton: new sap.m.Button({
//             // icon: "sap-icon://accept",
//             // type: "Accept",
//             text: "Cancel",
//             press: function (oEvent2) {
//               sap.m.MessageToast.show("action cancelled");
//               dialog.close();
//             }
//             // press: onSaveItem()
//           }),
//           afterClose: function () {
//             dialog.destroy();
//           }
//         });
//         this.getView().addDependent(dialog);

//         dialog.open();

//         oTable.refresh();
//       }
//     },
//     OnSave: function (oEvent) {
//       sap.m.MessageToast.show("Comments really saved");
//     },
//     valueHelpRequested: function (oEvent2) {
//       sap.m.MessageToast.show("Value Help");
//     },
//     handleDialogPress: function (oEvent) {
//       this.oMessageView.navigateBack();
//       this.oDialog.open();
//     }

//   });
// })

