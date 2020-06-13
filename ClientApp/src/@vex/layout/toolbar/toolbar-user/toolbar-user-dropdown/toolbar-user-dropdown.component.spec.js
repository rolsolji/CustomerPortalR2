"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var toolbar_user_dropdown_component_1 = require("./toolbar-user-dropdown.component");
describe('ToolbarUserDropdownComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [toolbar_user_dropdown_component_1.ToolbarUserDropdownComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(toolbar_user_dropdown_component_1.ToolbarUserDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=toolbar-user-dropdown.component.spec.js.map