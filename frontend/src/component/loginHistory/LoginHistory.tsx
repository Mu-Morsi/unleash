import { ADMIN } from 'component/providers/AccessProvider/permissions';
import { PermissionGuard } from 'component/common/PermissionGuard/PermissionGuard';
import { LoginHistoryTable } from './LoginHistoryTable/LoginHistoryTable.tsx';
import { READ_LOGS } from '@server/types/permissions';

export const LoginHistory = () => {
    return (
        <div>
            <PermissionGuard permissions={[ADMIN, READ_LOGS]}>
                <LoginHistoryTable />
            </PermissionGuard>
        </div>
    );
};
