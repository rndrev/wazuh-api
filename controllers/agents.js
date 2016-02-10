/**
 * API RESTful for OSSEC
 * Copyright (C) 2015-2016 Wazuh, Inc.All rights reserved.
 * Wazuh.com
 *
 * This program is a free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

var express = require('express');
var router = express.Router();
var agent = require('../models/agent');
var rh = require('../helpers/response_handler');
var logger = require('../helpers/logger');
var validator = require('../helpers/input_validation');

/**
 * GET /agents - Get agents list
 * GET /agents/:agent_id/key - Get Agent Key
 * GET /agents/:agent_id/syscheck/modified_files - List modified files for the agent.
 * GET /agents/:agent_id/rootcheck - Get rootcheck database
 * GET /agents/:agent_id - Get Agent Info
 *
 * PUT /agents/:agent_name - Add Agent
 * PUT /agents/:agent_id/restart - Restart Agent
 * PUT /agents/syscheck - Run syscheck in all agents.
 * PUT /agents/:agent_id/syscheck - Run syscheck in the agent.
 * PUT /agents/rootcheck - Run rootcheck in all agents:
 * PUT /agents/:agent_id/rootcheck - Run rootcheck in the agent.
 *
 * DELETE /agents/syscheck - Clear the database for all agent.
 * DELETE /agents/:agent_id/syscheck - Clear the database for the agent.
 * DELETE /agents/rootcheck - Clear the database for all agent.
 * DELETE /agents/:agent_id/rootcheck - Clear the database for the agent.
 * DELETE /agents/:agent_id - Remove Agent
 *
**/

/********************************************/
/* GET
/********************************************/

// GET /agents - Get agents list
router.get('/', function(req, res) {
    logger.log(req.host + " GET /agents");
    agent.all(function (data) {
        rh.cmd(data, res);
    });
})

// GET /agents/:agent_id/key - Get Agent Key
router.get('/:agent_id/key', function(req, res) {
    logger.log(req.host + " GET /agents/:agent_id/key");

    if (validator.numbers(req.params.agent_id)){
        agent.get_key(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// GET /agents/:agent_id/syscheck/modified_files - List modified files for the agent.
router.get('/:agent_id/syscheck/modified_files', function(req, res) {
    logger.log(req.host + " GET /agents/:agent_id/syscheck/modified_files");

    if (validator.numbers(req.params.agent_id)){
        agent.syscheck_modified_files(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// GET /agents/:agent_id/rootcheck - Get rootcheck database
router.get('/:agent_id/rootcheck', function(req, res) {
    logger.log(req.host + " GET /agents/:agent_id/rootcheck");

    if (validator.numbers(req.params.agent_id)){
        agent.print_rootcheck_db(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// GET /agents/:agent_id - Get Agent Info
router.get('/:agent_id', function(req, res) {
    logger.log(req.host + " GET /agents/:agent_id");
    
    if (validator.numbers(req.params.agent_id)){
        agent.info(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})


/********************************************/
/* PUT
/********************************************/

// PUT /agents/:agent_id/restart - Restart Agent
router.put('/:agent_id/restart', function(req, res) {
    logger.log(req.host + " PUT /agents/:agent_id/restart");
    
    if (validator.numbers(req.params.agent_id)){
        agent.restart(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// PUT /agents/syscheck - Run syscheck in all agents.
router.put('/syscheck', function(req, res) {
    logger.log(req.host + " PUT /agents/syscheck");
    agent.run_syscheck("ALL", function (data) {
        rh.cmd(data, res);
    });
})

// PUT /agents/:agent_id/syscheck - Run syscheck in the agent.
router.put('/:agent_id/syscheck', function(req, res) {
    logger.log(req.host + " PUT /agents/:agent_id/syscheck");

    if (validator.numbers(req.params.agent_id)){
        agent.run_syscheck(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// PUT /agents/rootcheck - Run rootcheck in all agents:
router.put('/rootcheck', function(req, res) {
    logger.log(req.host + " PUT /agents/rootcheck");
    agent.run_syscheck("ALL", function (data) {
        rh.cmd(data, res);
    });
})

// PUT /agents/:agent_id/rootcheck - Run rootcheck in the agent.
router.put('/:agent_id/rootcheck', function(req, res) {
    logger.log(req.host + " PUT /agents/:agent_id/rootcheck");

    if (validator.numbers(req.params.agent_id)){
        agent.run_rootcheck(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }
})

// PUT /agents/:agent_name - Add Agent
router.put('/:agent_name', function(req, res) {
    logger.log(req.host + " PUT /agents/:agent_name");
    
    if (validator.names(req.params.agent_name)){
        agent.add(req.params.agent_name, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("601", "agent_name", res);
    }

})


/********************************************/
/* DELETE
/********************************************/

// DELETE /agents/syscheck - Clear the database for all agent.
router.delete('/syscheck', function(req, res) {
    logger.log(req.host + " DELETE /agents/syscheck");
        agent.clear_syscheck("ALL", function (data) {
            rh.cmd(data, res);
        });

})

// DELETE /agents/:agent_id/syscheck - Clear the database for the agent.
router.delete('/:agent_id/syscheck', function(req, res) {
    logger.log(req.host + " DELETE /agents/:agent_id/syscheck");
    
    if (validator.numbers(req.params.agent_id)){
        agent.clear_syscheck(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }

})

// DELETE /agents/rootcheck - Clear the database for all agent.
router.delete('/rootcheck', function(req, res) {
    logger.log(req.host + " DELETE /agents/rootcheck");
        agent.clear_rootcheck("ALL", function (data) {
            rh.cmd(data, res);
        });

})

// DELETE /agents/:agent_id/rootcheck - Clear the database for the agent.
router.delete('/:agent_id/rootcheck', function(req, res) {
    logger.log(req.host + " DELETE /agents/:agent_id/rootcheck");
    
    if (validator.numbers(req.params.agent_id)){
        agent.clear_rootcheck(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }

})

// DELETE /agents/:agent_id - Remove Agent
router.delete('/:agent_id', function(req, res) {
    logger.log(req.host + " DELETE /agents/:agent_id");
    
    if (validator.numbers(req.params.agent_id)){
        agent.remove(req.params.agent_id, function (data) {
            rh.cmd(data, res);
        });
    }
    else{
        rh.bad_request("600", "agent_id", res);
    }

})


/********************************************/
/* PATCH
/********************************************/



module.exports = router;
