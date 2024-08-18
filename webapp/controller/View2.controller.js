sap.ui.define([
    'tcs/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("tcs.fin.ap.controller.View2", {
        //This is our app controller 😊
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            //Whenever we click a fruit, the route is changing
            //this change of route we need to handle via event
            //so here we attaching a event to a function
            //whenever route change, call my function herculis
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        herculis: function (oEvent) {
            var fruitId = oEvent.getParameter("arguments").fruitId;
            var sPath = '/fruits/' + fruitId;
            this.getView().bindElement(sPath);
            //debugger;
        },
        onNavNextRow: function (oEvent) {
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            MessageToast.show(sPath);
            //TODO: Implement level3 navigationt to another view Supplier
        },
        oSupplierPopUp: null,
        oCityPopup: null,
        oField: null,
        onFilter: function () {

            var that = this;
            if (!this.oSupplierPopUp) {
                Fragment.load({
                    id: "supplier",
                    name: "tcs.fin.ap.fragments.popup",
                    controller: this
                }).then(function (oDilogue) {
                    that.oSupplierPopUp = oDilogue;
                    that.oSupplierPopUp.setTitle("Supplier Details");
                    that.getView().addDependent(oDilogue);
                    that.oSupplierPopUp.bindAggregation("items", {
                        path: "/suppliers",
                        template: new sap.m.DisplayListItem(
                            {
                                label: "{name}",
                                value: "{city}"
                            }

                        )
                    });
                    that.oSupplierPopUp.open();
                });
            } else {

                this.oSupplierPopUp.open();
            }

        },



        onF4Help: function (oEvent) {
            this.oField = oEvent.getSource();
            var that = this;
            if (!this.oCityPopup) {
                Fragment.load({
                    id: "cities",
                    controller: this,
                    name: "tcs.fin.ap.fragments.popup"
                }).then(function (oDialogue) {
                    that.oCityPopup = oDialogue,
                    that.oCityPopup.setTitle("List of Cities");
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setMultiSelect(false);
                    that.oCityPopup.bindAggregation("items", {
                        path: "/cities",
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                    })
                    });
                    that.oCityPopup.open();

                });
            } else {

                this.oCityPopup.open();
            }
            // MessageToast.show("This functionality is under construction");
        },
        
        onItemSelect: function(oEvent){
            debugger;
            var sID = oEvent.getSource().getId();
            if(sID.indexOf("cities") !== -1){
                var sItem = oEvent.getParameter("selectedItem");
                var sText = sItem.getLabel();
                this.oField.setValue(sText);
            }else{
                var aFilters = [];
                var sItem = oEvent.getParameter("selectedItems");
                for (let index = 0; index < sItem.length; index++) {
                    const element = sItem[index];
                    
                var oFilter = new Filter("name", FilterOperator.EQ, element.getLabel());
                aFilters.push(oFilter);
                }

                var oFilterFinal = new Filter({
                   filters: aFilters,
                   and: false

                });

                this.getView().byId("idTab").getBinding("items").filter(oFilterFinal);
            }         
        },
        onLiveChange: function (oEvent) {
            debugger;
            var oValue = oEvent.getParameter("value");
            var aFilter = new Filter("name", FilterOperator.Contains, oValue);
            oEvent.getSource().getBinding("items").filter(aFilter);
        },
        onSave: function () {
            MessageBox.confirm("Do you want to save?", {
                title: "Confirmation for Save",
                onClose: function (status) {
                    if (status === "OK") {
                        MessageToast.show("Your order has been placed successfully!");
                    } else {
                        MessageBox.alert("Could not save");
                    }
                }
            });
        },
        onPrintSelect: function () {
            var oDD = this.getView().byId("mcb");
            var aItems = oDD.getSelectedItems();
            for (let i = 0; i < aItems.length; i++) {
                const element = aItems[i];
                console.log(element.getKey());
            }
        },
        onCancel: function () {
            MessageBox.error("Failed to save");
        },
        onBack: function () {
            //Go to the parent now -appCon object is obtained
            var oAppCon = this.getView().getParent();
            //Using the parent we go to child = navigate to another child
            oAppCon.to("idView1");
        }
    });
});
