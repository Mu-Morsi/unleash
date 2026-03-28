'use strict';

const async = require('async');
const retailUnitRollout = require('./retail-unit-rollout-strategy.json');

function insertStrategySQL(strategy) {
    return `
        INSERT INTO strategies (name, description, parameters, built_in, sort_order)
        SELECT '${strategy.name}', '${strategy.description}', '${JSON.stringify(
        strategy.parameters,
    )}', 0, 5
        WHERE
            NOT EXISTS (
                SELECT name FROM strategies WHERE name = '${strategy.name}'
        );`;
}

function insertEventsSQL(strategy) {
    return `
        INSERT INTO events (type, created_by, data)
        SELECT 'strategy-created', 'migration', '${JSON.stringify(strategy)}'
        WHERE
            NOT EXISTS (
                SELECT name FROM strategies WHERE name = '${strategy.name}'
        );`;
}

function removeEventsSQL(strategy) {
    return `
        INSERT INTO events (type, created_by, data)
        SELECT 'strategy-deleted', 'migration', '${JSON.stringify(strategy)}'
        WHERE
            EXISTS (
                SELECT name FROM strategies WHERE name = '${strategy.name}'
        );`;
}

function removeStrategySQL(strategy) {
    return `
        DELETE FROM strategies
        WHERE name = '${strategy.name}'`;
}

exports.up = function (db, callback) {
    async.series(
        [
            // 1. Add the retail unit context field with legal values
            db.runSql.bind(
                db,
                `
                INSERT INTO context_fields(name, description, sort_order, stickiness, legal_values)
                VALUES(
                    'retailUnit',
                    'Allows you to constrain on retail unit (country code)',
                    6,
                    true,
                    '[
                        {"value": "AU", "description": "Australia"},
                        {"value": "AT", "description": "Austria"},
                        {"value": "BE", "description": "Belgium"},
                        {"value": "CA", "description": "Canada"},
                        {"value": "CN", "description": "China"},
                        {"value": "HR", "description": "Croatia"},
                        {"value": "CZ", "description": "Czech Republic"},
                        {"value": "DK", "description": "Denmark"},
                        {"value": "FI", "description": "Finland"},
                        {"value": "FR", "description": "France"},
                        {"value": "DE", "description": "Germany"},
                        {"value": "HU", "description": "Hungary"},
                        {"value": "IN", "description": "India"},
                        {"value": "IE", "description": "Ireland"},
                        {"value": "IT", "description": "Italy"},
                        {"value": "JP", "description": "Japan"},
                        {"value": "NL", "description": "Netherlands"},
                        {"value": "NZ", "description": "New Zealand"},
                        {"value": "NO", "description": "Norway"},
                        {"value": "PL", "description": "Poland"},
                        {"value": "PT", "description": "Portugal"},
                        {"value": "RO", "description": "Romania"},
                        {"value": "RS", "description": "Serbia"},
                        {"value": "SK", "description": "Slovakia"},
                        {"value": "SI", "description": "Slovenia"},
                        {"value": "KR", "description": "South Korea"},
                        {"value": "ES", "description": "Spain"},
                        {"value": "SE", "description": "Sweden"},
                        {"value": "CH", "description": "Switzerland"},
                        {"value": "GB", "description": "United Kingdom"},
                        {"value": "US", "description": "United States of America"}
                    ]'::json
                )
                ON CONFLICT DO NOTHING;
                `,
            ),
            // 2. Add the retail unit rollout strategy
            db.runSql.bind(db, insertEventsSQL(retailUnitRollout)),
            db.runSql.bind(db, insertStrategySQL(retailUnitRollout)),
        ],
        callback,
    );
};

exports.down = function (db, callback) {
    async.series(
        [
            db.runSql.bind(db, removeEventsSQL(retailUnitRollout)),
            db.runSql.bind(db, removeStrategySQL(retailUnitRollout)),
            db.runSql.bind(
                db,
                `
                DELETE FROM context_fields WHERE name = 'retailUnit';
                `,
            ),
        ],
        callback,
    );
};
