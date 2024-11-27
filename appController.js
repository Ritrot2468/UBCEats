const express = require('express');
// import express from "express";
// import appService from './appService.js'; // Add .js extension if necessary
const appService = require('./appService');

const router = express.Router();


// ----------------------------------------------------------
// API endpoints

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    console.log(isConnect)
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/usertable', async (req, res) => {
    const tableContent = await appService.fetchUserTableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-usertable", async (req, res) => {
    const initiateResult = await appService.initiateUserTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-usertable", async (req, res) => {
    const { Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude } = req.body;
    const insertResult = await appService.insertUserTable(Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/find-restaurants", async (req, res) => {
    console.log("entered endpoint")
    const restaurantName = req.query.restaurantName;
    const initiateResult = await appService.findRestaurant(restaurantName);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});
router.get("/fetch-user-review", async (req, res) => {
    const reviewID = req.query.reviewID;
    const initiateResult = await appService.fetchAUserReview(reviewID);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/fetch-user-reviews", async (req, res) => {
    const userName = req.query.userName;
    const initiateResult = await appService.fetchAllReviewsFromUser(userName);
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/fetch-all-restaurants", async (req, res) => {

    const initiateResult = await appService.fetchAllRestaurantsFromDb();
    console.log(initiateResult)
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});

// H
router.get("/:restaurantId/menu", async (req, res) => {
    let restaurantId = req.params.restaurantId;

    const initiateResult = await appService.fetchRestaurantMenuFromDb(restaurantId);
    console.log(initiateResult);
    if (initiateResult) {
        res.json({ success: true, result: initiateResult});
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/update-review-content", async (req, res) => {
    const { oldContent, newContent, columnName, reviewID} = req.body;
    const updateResult = await appService.updateReviewContent(oldContent, newContent, columnName, reviewID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-to-dietary-profile", async (req, res) => {
    const {foodType, userName, profileName} = req.body;
    const updateResult = await appService.addItemToDietaryProfile(foodType, userName, profileName)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/remove-from-dietary-profile", async (req, res) => {
    const {foodType, userName, profileName} = req.body;
    const updateResult = await appService.removeItemFromDietaryProfile(foodType, userName, profileName)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/remove-review-content", async (req, res) => {
    const {content, userName, restLong, restLat} = req.body;
    const updateResult = await appService.deleteReviewContent(content, userName, restLong, restLat);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});





module.exports = router;