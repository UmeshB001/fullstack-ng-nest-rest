import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';


@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();

        // Check if the user has the 'admin' role
        if (user?.role === 'admin') {
            return true;
        }

        throw new ForbiddenException('Access denied: Only Admins can access this action');
    }
}
