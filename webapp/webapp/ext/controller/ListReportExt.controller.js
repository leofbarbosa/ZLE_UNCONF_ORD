sap.ui.controller("com.touchette.unconfirmedorders.ext.controller.ListReportExt", {

  onInit: function() {
    this.getOwnerComponent().getModel("sourcConfig").setData({
      InventoryVisibility: "N",
      WaiveShippingFlag: false,
      AcceptSaturdayFlag: true
    });
  },

  onClickActionZC_SD_UNCONFITEM1: function (oEvent) {
    var oSourcConfigModel = this.getOwnerComponent().getModel("sourcConfig");

    if (Object.keys(oSourcConfigModel.getData()).length === 0) {
      oSourcConfigModel.setData({
        InventoryVisibility: "N",
        WaiveShippingFlag: false,
        AcceptSaturdayFlag: true
      });
    }

    var dialog = new sap.m.Dialog('dialog', {
        title: 'Enter Value',
        type: 'Message',
        contentWidth: '400px',
        content: [
          new sap.ui.layout.form.SimpleForm({
            editable: true,
            layout: 'ResponsiveGridLayout',
            content: [
              new sap.m.Label({ text: "Inventory Visibility" }),
              new sap.m.ComboBox("invVisCb", { 
                width: "150px",
                items: {
                                    path: '/Z_TVK2_CDS',
                                    template: new sap.ui.core.Item({
                                        key: "{InventoryVisibility}",
                                        text: "{InventoryVisibility_Text}"
                                    }),
                                    events: {
                                      change: function() {
                                          var comboBox = sap.ui.getCore().byId("invVisCb");
                      var comboBoxItems = comboBox.getItems();
                      comboBox.setSelectedItem(comboBoxItems[0]);
                                        }
                                    }
                                },
                                selectedKey: "{sourcConfig>/InventoryVisibility}"
              }),
              new sap.m.CheckBox({ text: "Accept Saturday?", selected: "{sourcConfig>/AcceptSaturdayFlag}" }),
              new sap.m.CheckBox({ text: "Waive Shipping Fees", selected: "{sourcConfig>/WaiveShippingFlag}" })
            ]
          })
        ],
        beginButton: new sap.m.Button({
          // icon: "sap-icon://accept",
          // type: "Accept",
          text: "Close",
          press: function (oEvent2) {
            sap.m.MessageToast.show("Sourcing logic settings saved");
            dialog.close();
          }
          // press: onSaveItem()
        }),
        // endButton: new sap.m.Button({
        //  icon: "sap-icon://decline",
        //  type: "Reject",
        //  //text: 'Cancel',
        //  press: function () {
        //    dialog.close();
        //  }
        // }),
        afterClose: function() {
          dialog.destroy();
        }
      });

      this.getView().addDependent(dialog);

      dialog.open();

  }

});