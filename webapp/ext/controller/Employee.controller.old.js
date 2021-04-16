sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/core/IconPool',
	'sap/ui/model/json/JSONModel',
	'sap/m/Link',
	'sap/m/MessageItem',
	'sap/m/MessageView',
	'sap/ui/core/ValueState',
	'sap/m/Button',
	'sap/m/ButtonType',
	'sap/m/Dialog',
	'sap/m/DialogType',
	'sap/m/Bar',
	'sap/m/Text',
	'sap/ui/core/Fragment',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/Model',
	"sap/m/MessageBox"
], function (Controller, IconPool, JSONModel, Link, MessageItem, MessageView, ValueState, Button, ButtonType, Dialog, DialogType, Bar, Text, Fragment, Filter, FilterOperator, Model, MessageBox) {
	"use strict";

	sap.ui.controller("com.touchette.unconfirmedorders.ext.controller.ListReportExt", {

		onInit: function () {
			this.getOwnerComponent().getModel("sourcConfig").setData({
				InventoryVisibility: "N",
				WaiveShippingFlag: false,
				AcceptSaturdayFlag: true
			});
		},

		onRelease: function (oEvent) {
			//sap.m.MessageToast.show("Release");

			var oTable = this.getOwnerComponent().getModel();
			var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
			if (oSel.length == 0) {
				sap.m.MessageBox.error("Select a line");
			} else {
				var len = oSel[0].mAggregations.cells.length;
				for (let i = 0; i < len; i++) {
					if (oSel[0].mAggregations.cells[i].mBindingInfos.text) {
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderNumber") {
							var vVbeln = oSel[0].mAggregations.cells[i].mProperties.text;
						};
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderItem") {
							var vPosnr = oSel[0].mAggregations.cells[i].mProperties.text;
						};
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "SchedLine") {
							var vEtenr = oSel[0].mAggregations.cells[i].mProperties.text;
						};
					};
				};
				var oFilters = [
					new sap.ui.model.Filter("OrderNumber", "EQ", vVbeln),
					new sap.ui.model.Filter("OrderItem", "EQ", vPosnr),
					new sap.ui.model.Filter("SchedLine", "EQ", vEtenr),
				];
				var vBlock;
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/") // connect to OData service
				oModel.read("/ZC_SD_UNCONFITEM", { // read OData entity
					async: false,
					filters: oFilters, // using the filter created above
					urlParameters: {
						"$select": "zstatus"
					}, // using the following parameters to select
					success: function (oData, response) {
						vBlock = oData.results[0].zstatus;
					},
					error: function (oError) {}
				});
				if (vBlock != "S6") {
					sap.m.MessageBox.error("Order not blocked by diff price");
				} else {
					var dialog = new sap.m.Dialog('dialog', {
						title: 'Confirm Diff Price Release',
						type: 'Message',
						contentWidth: '400px',
						content: [
							new sap.ui.layout.form.SimpleForm({
								editable: true,
								layout: 'ResponsiveGridLayout',
								content: [
									new sap.m.Label({
										text: "Release price diff?"
									})
								]
							})
						],
						beginButton: new sap.m.Button({
							// icon: "sap-icon://accept",
							// type: "Accept",
							text: "Release",
							press: function (oEvent2) {
								//sap.m.MessageToast.show("Price Diff Released");
								var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/");
								oModel.callFunction("/ReleaseItem", {
									method: "POST",
									urlParameters: {
										"OrderNumber": vVbeln,
										"OrderItem": vPosnr,
										"SchedLine": vEtenr
									},
									success: fSucess,
									error: fError
								});

								function fSucess(oData, oResponse) {
									sap.m.MessageBox.success("Order: " + vVbeln + " / Item: " + vPosnr + " Released");
								};

								function fError(oError) {
									sap.m.MessageBox.error("Error releasing order: " + vVbeln + " / Item: " + vPosnr);
								};
								oModel.refresh();
								oTable.refresh();
								dialog.close();
							}
						}),

						endButton: new sap.m.Button({
							text: "Cancel",
							press: function (oEvent2) {
								sap.m.MessageToast.show("action cancelled");
								dialog.close();
							}
						}),

						afterClose: function () {
							dialog.destroy();
						}
					});
					this.getView().addDependent(dialog);

					dialog.open();
				}
			}
		},

		onComment: function (oEvent) {
			// this._getDialog().open();
			var oTable = this.getOwnerComponent().getModel();
			var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
			if (oSel.length == 0) {
				sap.m.MessageBox.error("Select a line");
			} else {
				var oView = this.getView();
				var oDialog = oView.byId("employeeDialog");
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "com.touchette.unconfirmedorders.ext.view.Employee", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				};

				var oTable = this.getOwnerComponent().getModel();
				var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
				var vPernr;
				var vComm;
				var vEmployee;

				var len = oSel[0].mAggregations.cells.length;
				for (let i = 0; i < len; i++) {
					if (oSel[0].mAggregations.cells[i].mBindingInfos.text) {
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderNumber") {
							var vVbeln = oSel[0].mAggregations.cells[i].mProperties.text;
						};
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderItem") {
							var vPosnr = oSel[0].mAggregations.cells[i].mProperties.text;
						};
						if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "SchedLine") {
							var vEtenr = oSel[0].mAggregations.cells[i].mProperties.text;
						};
					};
				};
				var oFilters = [
					new sap.ui.model.Filter("OrderNumber", "EQ", vVbeln),
					new sap.ui.model.Filter("OrderItem", "EQ", vPosnr),
					new sap.ui.model.Filter("SchedLine", "EQ", vEtenr),
				];
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/") // connect to OData service
				oModel.read("/ZC_SD_UNCONFITEM", { // read OData entity
					async: false,
					filters: oFilters, // using the filter created above
					urlParameters: {
						"$select": "pernr,Comments,Employee"
					}, // using the following parameters to select
					success: function (oData, response) {

						vPernr = oData.results[0].pernr;
						vComm = oData.results[0].Comments;
						vEmployee = oData.results[0].Employee;
					},
					error: function (oError) {}
				});
				// if ( vPernr == 0){
				// 	vPernr = "";
				// };
				// defining values
				oDialog.mAggregations.content[0].mAggregations.content[1].mProperties.value = vEmployee;
				oDialog.mAggregations.content[0].mAggregations.content[1].mProperties.text = vPernr;
				oDialog.mAggregations.content[0].mAggregations.content[3].mProperties.value = vComm;
				// disable ESC
				//oDialog.attachBrowserEvent("keydown", function (oEvent) {
				//oEvent.stopPropagation();

				// disable all keys - input only by search help
				//oEvent.preventDefault();
				//});
				oDialog.setEscapeHandler("onEscapeHandler");
				oDialog.open();
			}

		},

		// onSuggest: function (oEvent) {
		// 	debugger;
		// },

		onValueHelpRequest: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("com.touchette.unconfirmedorders.ext.view.Dialog", this);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			//  this._valueHelpDialog.getBinding("items").filter([new Filter("vbeln", sap.ui.model.FilterOperator.Contains, sInputValue)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(); //sInputValue);
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter("EmployeeFullName", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getDescription());
				productInput.mProperties.text = oSelectedItem.getTitle();
			}
			evt.getSource().getBinding("items").filter([]);
		},

		onCloseDialog: function () {
			sap.m.MessageToast.show("action cancelled");
			this.byId("employeeDialog").close();
		},
		onShowHello: function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},

		onOpenDialog: function () {
			var oView = this.getView();
			var oDialog = oView.byId("employeeDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "com.touchette.unconfirmedorders.ext.view.Employee", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}

			oDialog.open();
		},

		onPressSave: function (oEvent) {
			var oTable = this.getOwnerComponent().getModel();
			var oSel = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--responsiveTable").getSelectedItems();
			var vPernr;
			var vComm;

			var len = oSel[0].mAggregations.cells.length;
			for (let i = 0; i < len; i++) {
				if (oSel[0].mAggregations.cells[i].mBindingInfos.text) {
					if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderNumber") {
						var vVbeln = oSel[0].mAggregations.cells[i].mProperties.text;
					};
					if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "OrderItem") {
						var vPosnr = oSel[0].mAggregations.cells[i].mProperties.text;
					};
					if (oSel[0].mAggregations.cells[i].mBindingInfos.text.binding.sPath == "SchedLine") {
						var vEtenr = oSel[0].mAggregations.cells[i].mProperties.text;
					};
				};
			};

			if (this.byId("employeeInput").getValue()) {
				var vEmp = this.byId("employeeInput").getSelectedKey(); //this.byId("employeeInput").mProperties.text; //getValue();
				var vCom = this.byId("commentInput").getValue();
			} else {
				this.byId("employeeInput").setValue("");
			}
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/");
			this.byId("employeeDialog").close();
			oModel1.callFunction("/ChangePartner", {
				method: "POST",
				urlParameters: {
					"OrderNumber": vVbeln,
					"OrderItem": vPosnr,
					"SchedLine": vEtenr,
					"pernr": vEmp,
					"Comments": vCom
				},
				success: fSucess,
				error: fError
			});

			function fSucess(oData1, oResponse) {
				sap.m.MessageBox.success("Order: " + vVbeln + " changed", {
					initialFocus: sap.m.MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === sap.m.MessageBox.Action.OK) {
							oModel1.refresh();
							oTable.refresh();
						};
					}
				});
			};

			function fError(oError) {
				//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
				var xmlRead = oError.response.body;
				var parser = new DOMParser();
				var xmldoc = parser.parseFromString(xmlRead, "text/xml");
				var messages = xmldoc.getElementsByTagName("message");
				var types = xmldoc.getElementsByTagName("severity"); // parei aqui
				var len = messages.length;
				var text = new Array();

				var oMessageTemplate = new MessageItem({
					type: '{type}',
					title: '{title}',
					description: '{description}',
					subtitle: '{subtitle}',
					counter: '{counter}',
					markupDescription: '{markupDescription}'
				});
				var msgType;
				var msgMsg;
				var aMessages = [];
				for (let i = 1; i < len; i++) {
					msgType = types[i - 1].textContent;
					msgMsg = messages[i].textContent
					var oMessage = {
						type: msgType,
						description: msgMsg
					};
					aMessages.push(oMessage);
				};


				var oModel = new sap.ui.model.json.JSONModel(); // new JSONModel();
				oModel.setData(aMessages);
				var that = this;
				var oBackButton = new sap.m.Button({
					icon: sap.ui.core.IconPool.getIconURI("navback"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

				var oMessageView = new sap.m.MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});

				oMessageView.setModel(oModel, oMessageTemplate);

				var oDialog1 = new sap.m.Dialog({
					resizable: true,
					content: oMessageView, //oModel, //oMessageView.oModels["Element sap.m.Link#__link2"].oData,
					state: 'Error',
					beginButton: new sap.m.Button({
						press: function () {
							this.getParent().close();
						},
						text: "Close"
					}),
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new Text({
								text: "Error"
							})
						],
						contentLeft: [oBackButton]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});
				oMessageView.navigateBack();
				oDialog1.open();

				// 	var oCloseButton =  new Button({
				// 		text: "Close",
				// 		press: function () {
				// 			that._oPopover.close();
				// 		}
				// 	}),
				// 	oPopoverFooter = new sap.m.Bar({
				// 		contentRight: oCloseButton
				// 	}),
				// 	oPopoverBar = new sap.m.Bar({
				// 		contentLeft: [oBackButton],
				// 		contentMiddle: [
				// 			new Text({
				// 				text: "Messages"
				// 			})
				// 		]
				// 	});

				// var _oPopover = new sap.m.Popover({
				// 	customHeader: oPopoverBar,
				// 	contentWidth: "440px",
				// 	contentHeight: "440px",
				// 	verticalScrolling: false,
				// 	modal: true,
				// 	content: [oMessageView],
				// 	footer: oPopoverFooter
				// });

				// oMessageView.navigateBack();
				// _oPopover.openBy(oEvent.getSource());


				//sap.m.MessageBox.error(text);
				//sap.m.MessageBox.error("Error changing order: " + vVbeln);
				oModel1.refresh();
				oTable.refresh();
			};
		},
	});
})