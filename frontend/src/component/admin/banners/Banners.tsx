import { ADMIN } from 'component/providers/AccessProvider/permissions';
import { PermissionGuard } from 'component/common/PermissionGuard/PermissionGuard';
import { BannersTable } from './BannersTable/BannersTable.tsx';
import { UPDATE_INSTANCE_BANNERS } from '@server/types/permissions';

export const Banners = () => {
    return (
        <div>
            <PermissionGuard permissions={[ADMIN, UPDATE_INSTANCE_BANNERS]}>
                <BannersTable />
            </PermissionGuard>
        </div>
    );
};
