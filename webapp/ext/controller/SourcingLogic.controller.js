/* eslint-env es6 */
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/Button",
  "sap/m/Dialog",
  "sap/m/Label",
  "sap/m/MessageToast",
  "sap/m/Text",
  "sap/m/Input",
  "sap/m/CheckBox",
  "sap/m/FlexBox",
  "sap/ui/layout/form/SimpleForm",
  "sap/m/ComboBox",
  "sap/m/MessageBox",
  "com/touchette/unconfirmedorders/util/formatter"
], function (Controller, JSONModel, Button, Dialog, Label, MessageToast, Text, Input, CheckBox, FlexBox, SimpleForm, ComboBox, MessageBox, formatter) {
  "use strict";

  return Controller.extend("com.touchette.unconfirmedorders.ext.controller.SourcingLogic", {
    formatter: formatter,

    onInit: function() {

      var oModel = this.getOwnerComponent().getModel();
      this.oModel = oModel;
      this.oDialogModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_UNCONFIRMED_ORDERS_SRV/Z_TVK2_CDS", true);

      this._oDetailView = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ObjectPage.view.Details::ZC_SD_UNCONFITEM");
      this._oDetailController = this._oDetailView.getController();

      let sLastPath = "";

      this._oDetailView.attachEvent("modelContextChange", oEvent => {
        if (this._oDetailView.getBindingContext()) {
          this._oContext = this._oDetailView.getBindingContext();

          if (this._oContext.getPath()) {
            this._sPath = this._oContext.getPath();
          }

          let sourcConfigData = this._oDetailView.getModel("sourcConfig").getData();

          this.oProperty = oModel.getProperty(this._sPath);
          if (this.oProperty) {
            oModel = this._oDetailView.getModel();
            let oPath = oModel.createKey("/UserSelectionSet", {
              SalesOrderNumber: this.oProperty.OrderNumber,
              SalesOrderItem: this.oProperty.OrderItem,
              RequestedQty: this.oProperty.OrderQty,
              InventoryVisibility: sourcConfigData.InventoryVisibility,
              WaiveShippingFlag: sourcConfigData.WaiveShippingFlag,
              AcceptSaturdayFlag: sourcConfigData.AcceptSaturdayFlag
            });

            if (sLastPath !== oPath ) {
              sLastPath = oPath;
              this._oDetailView.bindElement({
                path : oPath,
                model: "sourcing"
              });
            }
          }
        }
      });

      // Overload the createEntry function to allow us to predefine
      //  some field values in child entries
    //  oModel.createEntry = function(sPath, mParameters) {
        // var aMatch = sPath.match(/\/User\('(\w+)'\)\/Contracts/);
        // if (aMatch instanceof Array)
        //  mParameters.properties = {
        //    UserID: aMatch[1]
        //  };

        // return sap.ui.model.odata.v2.ODataModel.prototype.createEntry.apply(this, arguments);
    //  };

      // When $batch requests are completed in the OData model, check to see if there were Objects
      //  created/updated. If so, refresh the Sourcing logic view
      // oModel.attachEvent("batchRequestCompleted", oEvent => {
      //  let bObjectSaved = oEvent.getParameters().requests
      //    .filter(e => e.method.match(/PUT|PATCH|MERGE|POST/))
      //    .length > 0;
      //  if (bObjectSaved)
      //    this._oDetailController.extensionAPI.rebind("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ObjectPage.view.Details::ZC_SD_UNCONFITEM--AfterFacet::ZC_SD_UNCONFITEM::GeneralInformation::SubSection-innerGrid");
      // });

    },

    onSourcLogicSave: function() {
      let oTable = this.getView().byId("idSourcLogicTable");
      let oSelection = oTable.getBindingContext("sourcing").getObject();
      let oObject;

      oSelection.Sourcings = oTable.getBinding("items").getContexts().map(function(c){
        oObject = c.getObject();
        delete oObject.__metadata;
        return oObject;
      });

      delete oSelection.__metadata;

      this.oModel.create("/UserSelectionSet", oSelection, {
        success: () => {
        	sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ObjectPage.view.Details::ZC_SD_UNCONFITEM--closeColumn").firePress();
        	var SmartTable = sap.ui.getCore().byId("com.touchette.unconfirmedorders::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SD_UNCONFITEM--listReport");
        	SmartTable.rebindTable();
        },
        error: (oError) => {
          MessageBox.error(JSON.parse(oError.responseText).error.message.value);
        }
      });
    },

    onNavToCheckAvail: function(oEvent){
      var oObject = oEvent.getSource().getBindingContext().getObject();
      var oTarget = {
        semanticObject: "MRPMaterial",
        action: "monitorSupplyAndDemand"
      };

      var oParams = {
        "Material": oObject.Material,
        "MRPPlant": oObject.Plant
      };

      this._navToExternalApp(oTarget, oParams);
    },

    onNavToDiffPriceRelease: function(){
      var oTarget = {
        semanticObject: "SalesOrder",
        action: "listToBeReleasedCustomerExpectedPrice"
      };

      this._navToExternalApp(oTarget);
    },

    onNavToDisplayOrder: function(oEvent){
      var oObject = oEvent.getSource().getBindingContext("sourcing").getObject();
      var oTarget = {
        semanticObject: "SalesOrder",
        action: "change"
      };

      var oParams = {
        "SalesOrder": oObject.SalesOrderNumber
      };

      this._navToExternalApp(oTarget, oParams);
    },

    onSourcLogicRefresh: function() {
      this._oDetailView.fireModelContextChange();
      this.byId("idSourcLogicSmartTable").rebindTable();
    },

    _navToExternalApp: function(oTarget, oParams){
      var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
      var hash = oCrossAppNavigator.hrefForExternal({
        target: oTarget,
        params: oParams
      });

      oCrossAppNavigator.toExternal({
        target: {
          shellHash: hash
        }
      });
    }

  });

});