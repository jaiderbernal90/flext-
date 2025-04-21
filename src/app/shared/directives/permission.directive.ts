import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { TokenService } from '../services/token.service'; // Ajusta la ruta

@Directive({
  selector: '[permission]',
  standalone: true
})
export class PermissionDirective {
  private hasView = false;
  private tokenService = inject(TokenService);

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set permission(permissionName: string) {
    const permissions = this.tokenService.getPermissionsUser();

    const hasPermission = permissions?.includes(permissionName);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
