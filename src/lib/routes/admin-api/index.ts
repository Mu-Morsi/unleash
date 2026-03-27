import Controller from '../controller.js';
import type { IUnleashConfig, IUnleashStores } from '../../types/index.js';
import FeatureController from '../../features/feature-toggle/legacy/feature-toggle-legacy-controller.js';
import { FeatureTypeController } from './feature-type.js';
import ArchiveController from '../../features/feature-toggle/archive-feature-toggle-controller.js';
import StrategyController from './strategy.js';
import EventController from './event.js';
import PlaygroundController from '../../features/playground/playground.js';
import MetricsController from './metrics.js';
import UserController from './user/user.js';
import UiConfigController from '../../ui-config/ui-config-controller.js';
import { ContextController } from '../../features/context/context.js';
import ClientMetricsController from '../../features/metrics/client-metrics/client-metrics.js';
import TagController from './tag.js';
import TagTypeController from '../../features/tag-type/tag-type.js';
import AddonController from './addon.js';
import { ApiTokenController } from './api-token.js';
import UserAdminController from './user-admin.js';
import EmailController from './email.js';
import UserFeedbackController from './user-feedback.js';
import UserSplashController from './user-splash.js';
import ProjectController from '../../features/project/project-controller.js';
import { EnvironmentsController } from '../../features/environments/environments-controller.js';
import ConstraintsController from '../../features/constraints/constraints-controller.js';
import PatController from './user/pat.js';
import { PublicSignupController } from './public-signup.js';
import InstanceAdminController from './instance-admin.js';
import TelemetryController from './telemetry.js';
import FavoritesController from './favorites.js';
import MaintenanceController from '../../features/maintenance/maintenance-controller.js';
import type { Db } from '../../db/db.js';
import ExportImportController from '../../features/export-import-toggles/export-import-controller.js';
import { SegmentsController } from '../../features/segment/segment-controller.js';
import { InactiveUsersController } from '../../users/inactive/inactive-users-controller.js';
import { UiObservabilityController } from '../../features/ui-observability-controller/ui-observability-controller.js';
import { SearchApi } from './search/index.js';
import PersonalDashboardController from '../../features/personal-dashboard/personal-dashboard-controller.js';
import FeatureLifecycleCountController from '../../features/feature-lifecycle/feature-lifecycle-count-controller.js';
import type { IUnleashServices } from '../../services/index.js';
import CustomMetricsController from '../../features/metrics/custom/custom-metrics-controller.js';
// INGKA Fork: Import RolesController for role management
import { RolesController } from './roles-controller.js';
import { PermissionsController } from './permissions.js';
import { GroupsController } from './groups.js';
import { ServiceAccountController } from './service-account.js';
// INGKA Fork: Import impact metrics and insights controllers
import { ImpactMetricsController } from './impact-metrics.js';
import { createImpactMetricsReadModel } from '../../features/metrics/impact/impact-metrics-read-model.js';
import { InsightsController } from './insights.js';
import { createInstanceInsightsReadModel } from '../../features/instance-insights/instance-insights-read-model.js';
import BannersController from './banners.js';
import LicenseController from './license.js';
import ReleasePlanTemplatesController from './release-plan-templates.js';
import ScimSettingsController from './scim-settings.js';
import AuthSettingsController from './auth-settings.js';
import TrafficController from './traffic.js';
import LoginsController from './logins.js';
import EdgesController from './edges.js';
import SignalEndpointsController from './signal-endpoints.js';

export class AdminApi extends Controller {
    constructor(
        config: IUnleashConfig,
        services: IUnleashServices,
        stores: IUnleashStores,
        db: Db,
    ) {
        super(config);

        this.app.use(
            '/features',
            new FeatureController(config, services).router,
        );

        this.app.use(
            '/feature-types',
            new FeatureTypeController(config, services).router,
        );
        this.app.use(
            '/archive',
            new ArchiveController(config, services).router,
        );
        this.app.use(
            '/strategies',
            new StrategyController(config, services).router,
        );
        this.app.use('', new EventController(config, services).router);
        this.app.use(
            '/playground',
            new PlaygroundController(config, services).router,
        );
        this.app.use(
            '/metrics',
            new MetricsController(config, services).router,
        );
        this.app.use(
            '/client-metrics',
            new ClientMetricsController(config, services).router,
        );
        this.app.use(
            '/custom-metrics',
            new CustomMetricsController(services, config).router,
        );
        this.app.use('/user', new UserController(config, services).router);
        this.app.use(
            '/user/tokens',
            new PatController(config, services).router,
        );

        this.app.use(
            '/ui-config',
            new UiConfigController(config, services).router,
        );
        this.app.use(
            '/context',
            new ContextController(config, services).router,
        );
        this.app.use(
            '/features-batch',
            new ExportImportController(config, services).router,
        );
        this.app.use('/tags', new TagController(config, services).router);
        this.app.use(
            '/tag-types',
            new TagTypeController(config, services).router,
        );
        this.app.use('/addons', new AddonController(config, services).router);
        this.app.use(
            '/api-tokens',
            new ApiTokenController(config, services).router,
        );
        this.app.use('/email', new EmailController(config, services).router);
        this.app.use(
            '/user-admin/inactive',
            new InactiveUsersController(config, services).router,
        ); // Needs to load first, so that /api/admin/user-admin/{id} doesn't hit first
        this.app.use(
            '/user-admin',
            new UserAdminController(config, services).router,
        );

        this.app.use(
            '/feedback',
            new UserFeedbackController(config, services).router,
        );
        this.app.use(
            '/projects',
            new ProjectController(config, services, db).router,
        );
        this.app.use(
            '/lifecycle',
            new FeatureLifecycleCountController(config, services, stores)
                .router,
        );
        this.app.use(
            '/personal-dashboard',
            new PersonalDashboardController(config, services).router,
        );
        this.app.use(
            '/environments',
            new EnvironmentsController(config, services).router,
        );
        this.app.use(
            '/splash',
            new UserSplashController(config, services).router,
        );
        this.app.use(
            '/constraints',
            new ConstraintsController(config, services).router,
        );
        this.app.use(
            '/invite-link',
            new PublicSignupController(config, services).router,
        );
        this.app.use(
            '/instance-admin',
            new InstanceAdminController(config, services).router,
        );
        this.app.use(
            `/projects`,
            new FavoritesController(config, services).router,
        );
        this.app.use(
            `/segments`,
            new SegmentsController(config, services).router,
        );
        this.app.use(
            '/maintenance',
            new MaintenanceController(config, services).router,
        );

        this.app.use(
            '/telemetry',
            new TelemetryController(config, services).router,
        );

        this.app.use('/search', new SearchApi(config, services, db).router);

        this.app.use(
            '/record-ui-error',
            new UiObservabilityController(config, services).router,
        );

        // INGKA Fork: Register roles, permissions, groups, and service-account controllers for role/group/service-account management
        this.app.use('/roles', new RolesController(config, services).router);
        this.app.use(
            '/permissions',
            new PermissionsController(config, services).router,
        );
        this.app.use('/groups', new GroupsController(config, services).router);
        this.app.use(
            '/service-account',
            new ServiceAccountController(config, services).router,
        );
        // INGKA Fork: Register impact-metrics controller
        const impactMetricsReadModel = createImpactMetricsReadModel(db);
        this.app.use(
            '/impact-metrics',
            new ImpactMetricsController(config, services, impactMetricsReadModel).router,
        );
        // INGKA Fork: Register insights controller
        const insightsReadModel = createInstanceInsightsReadModel(db);
        this.app.use(
            '/insights',
            new InsightsController(config, services, insightsReadModel).router,
        );
        // INGKA Fork: Register banners and license controllers
        this.app.use(
            '/banners',
            new BannersController(config, services).router,
        );
        this.app.use(
            '/license',
            new LicenseController(config, services).router,
        );
        this.app.use(
            '/release-plan-templates',
            new ReleasePlanTemplatesController(config, services).router,
        );
        this.app.use(
            '/scim-settings',
            new ScimSettingsController(config, services).router,
        );
        this.app.use(
            '/auth',
            new AuthSettingsController(config, services).router,
        );
        this.app.use(
            '/metrics/traffic',
            new TrafficController(config, services).router,
        );
        this.app.use(
            '/logins',
            new LoginsController(config, services).router,
        );
        this.app.use(
            '/metrics/edges',
            new EdgesController(config, services).router,
        );
        this.app.use(
            '/signal-endpoints',
            new SignalEndpointsController(config, services).router,
        );
    }
}
