import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <!-- prettier-ignore -->
    <dt-select placeholder="Choose service" aria-label="Choose service">
      <dt-option value="172.19.0.3:80">
        <dt-icon name="apache"></dt-icon>172.19.0.3:80
      </dt-option>
      <dt-option value="172.19.0.4:80">
        <dt-icon name="apache"></dt-icon>172.19.0.3:80
      </dt-option>
      <dt-option value="AuthenticationService">
        <dt-icon name="apache-tomcat"></dt-icon>AuthenticationService
      </dt-option>
      <dt-option value="BookingService">
        <dt-icon name="java"></dt-icon>BookingService
      </dt-option>
      <dt-option value="Communication layer">
        <dt-icon name="dotnet"></dt-icon>Communication layer
      </dt-option>
      <dt-option value="Configuration service">
        <dt-icon name="apache-tomcat"></dt-icon>Configuration service
      </dt-option>
      <dt-option value="Credit card verification">
        <dt-icon name="apache-tomcat"></dt-icon>Credit card verification
      </dt-option>
      <dt-option value="dotNetBackend_easyTravel_x64:9010">
        <dt-icon name="dotnet"></dt-icon>dotNetBackend_easyTravel_x64:9010
      </dt-option>
    </dt-select>
  `,
  styles: [
    `
      .dt-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        margin-bottom: 4px;
        vertical-align: middle;
      }
    `,
  ],
})
export class SelectWithIconsExample {}