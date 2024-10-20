import { Step } from '../impl/Step';

const data:any ={
    "id": "7410695263480332411",
    "enabled": true,
    "triggers": [
        {
            "trigger_id": "7410695265934911983",
            "trigger_phase": "MATCHING",
            "trigger_name": "EVENT",
            "trigger_description": null,
            "enabled": true,
            "negated": false,
            "event_names": [
                "share",
                "shared",
                "extole.share"
            ],
            "event_type": "INPUT",
            "component_ids": [
                "7378866381217516857"
            ],
            "trigger_type": "EVENT"
        },
        {
            "trigger_id": "7410695263422426901",
            "trigger_phase": "QUALITY",
            "trigger_name": "LEGACY_QUALITY",
            "trigger_description": null,
            "enabled": true,
            "negated": false,
            "action_type": "ANY_SHARE",
            "component_ids": [
                "7378866381217516857"
            ],
            "trigger_type": "LEGACY_QUALITY"
        }
    ],
    "component_ids": [
        "7378866381217516857"
    ],
    "created_date": "2024-09-04T08:02:28.242Z",
    "updated_date": "2024-09-04T11:10:41.745Z",
    "name": "share_event",
    "scope": "PRIVATE",
    "enabled_on_states": [
        "LIVE"
    ],
    "selectors": [
        "MATCHING_CAMPAIGN",
        "TARGET"
    ],
    "actions": [
        {
            "action_id": "7410695264518469058",
            "quality": "ALWAYS",
            "incentivize_action_type": "SHARE",
            "overrides": {
                "ZONE": "extole.share",
                "SOURCE_URL": "{{event.data['share.source_url']}}",
                "MESSAGE": "{{event.data['share.message']}}",
                "RECIPIENT": "{{event.data['share.recipient']}}",
                "CHANNEL": "{{event.data['share.channel']}}"
            },
            "action_name": null,
            "data": {},
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ],
            "review_status": "PENDING",
            "action_type": "INCENTIVIZE"
        },
        {
            "action_id": "7410695264718355416",
            "quality": "ALWAYS",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ],
            "action_type": "SHARE_EVENT"
        },
        {
            "action_id": "7410695265233201255",
            "quality": "ALWAYS",
            "polling_id": "{{ event.rootEventId }}",
            "name": "share",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ],
            "action_type": "STEP_SIGNAL"
        }
    ],
    "aliases": [
        "shared",
        "advocated"
    ],
    "data": [
        {
            "name": "advocate_code",
            "value": "spel@runtime:context.causeEvent.data['share.advocate_code']",
            "scope": "PRIVATE",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "NONE",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        },
        {
            "name": "share_message",
            "value": "spel@runtime:context.causeEvent.data['share.message']",
            "scope": "PRIVATE",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "NONE",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        },
        {
            "name": "share_subject",
            "value": "spel@runtime:context.causeEvent.data['share.subject']",
            "scope": "PRIVATE",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "NONE",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        },
        {
            "name": "recipient",
            "value": "spel@runtime:context.causeEvent.data['share.recipient']",
            "scope": "PRIVATE",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "NONE",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        },
        {
            "name": "partner_share_id",
            "value": "spel@runtime:context.causeEvent.data['partner_share_id']",
            "scope": "PUBLIC",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "UNIQUE_PARTNER_EVENT_KEY",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        },
        {
            "name": "share_input_event_id",
            "value": "spel@runtime:context.causeEvent.id",
            "scope": "PRIVATE",
            "dimension": false,
            "persist_types": [],
            "default_value": null,
            "key_type": "NONE",
            "enabled": true,
            "component_ids": [
                "7378866381217516857"
            ]
        }
    ],
    "journey_names": [
        "ADVOCATE"
    ],
    "send_policy": "ALL",
    "type": "CONTROLLER",
    "controller_id": "7410695263480332411"
}

const step = new Step(data);
console.log(step);
