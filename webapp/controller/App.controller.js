sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (JSONModel, Controller, MessageToast) {
		"use strict";

		return Controller.extend("com.gr.demo.controller.App", {
			onInit: function () {
				this.getView().bindElement("/Employees(1)");
				var oModel = new JSONModel({
					"isEdit": false
				});
				this.getView().setModel(oModel, "app");
			},

			onChange: function (oEvent) {
				if (oEvent.getParameter("editable")) {
					this.getView().getModel("app").setProperty("/isEdit", true);
				} else {
					this.getView().getModel("app").setProperty("/isEdit", false);
				}
			},

			onSave: function () {
				if (this.getOwnerComponent().getModel().hasPendingChanges()) {
					this.getOwnerComponent().getModel().submitChanges({
						success: function () {
							MessageToast.show("Success");
						},
						error: function () {
							MessageToast.show("Fail");
						}
					});
				} else {
					MessageToast.show("No Changes");
				}
			},

			onCancel: function () {
				this.getOwnerComponent().getModel().resetChanges();
				this.getView().getModel("app").setProperty("/isEdit", false);
			},

			onCreate: function () {
				this.oCreateDialog = sap.ui.xmlfragment("idProduct", "com.gr.demo.fragment.CreateProduct", this);
				this.getView().addDependent(this.oCreateDialog);
				var oContext = this.getOwnerComponent().getModel().createEntry("/Products");
				this.oCreateDialog.setBindingContext(oContext);
				this.oCreateDialog.setEscapeHandler(function () {
					this.oCreateDialog.destroy();
				}.bind(this));
				this.oCreateDialog.open();
			},

			onSaveDialog: function () {
				if (this.getOwnerComponent().getModel().hasPendingChanges()) {
					this.getOwnerComponent().getModel().submitChanges({
						success: function () {
							MessageToast.show("Success");
							this.oCreateDialog.destroy();
						},
						error: function () {
							MessageToast.show("Fail");
							this.oCreateDialog.destroy();
						}
					});
				} else {
					MessageToast.show("No Changes");
				}
			},

			onCloseDialog: function () {
				var oContext = this.oCreateDialog.getBindingContext();
				this.getOwnerComponent().getModel().deleteCreatedEntry(oContext);
				this.oCreateDialog.destroy();
			}

		});
	});
