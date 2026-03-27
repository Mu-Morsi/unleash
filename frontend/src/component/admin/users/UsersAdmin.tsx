import UsersList from './UsersList/UsersList.tsx';
import { ADMIN } from 'component/providers/AccessProvider/permissions';
import { PermissionGuard } from 'component/common/PermissionGuard/PermissionGuard';
import { Route, Routes } from 'react-router-dom';
import EditUser from './EditUser/EditUser.tsx';
import NotFound from 'component/common/NotFound/NotFound';
import { InactiveUsersList } from './InactiveUsersList/InactiveUsersList.tsx';
import { AccessOverview } from './AccessOverview/AccessOverview.tsx';

export const UsersAdmin = () => {
    return (
        <div>
            <PermissionGuard permissions={ADMIN}>
                <Routes>
                    <Route
                        index
                        element={
                            <>
                                <UsersList />
                            </>
                        }
                    />
                    <Route path=':id/edit' element={<EditUser />} />
                    <Route path=':id/access' element={<AccessOverview />} />
                    <Route
                        path='inactive'
                        element={<InactiveUsersList />}
                    />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </PermissionGuard>
        </div>
    );
};

export default UsersAdmin;
