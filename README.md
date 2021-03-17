# CS 4802 Final Project - CS BS Requirement Visualizer

Website: [https://dgcole.github.io/final/](https://dgcole.github.io/final/)

Screencast: (TODO)

Process book: (TODO)

# Overview

Our site serves as a way to visualize the requirements to obtain a BS in CS from WPI in a Treemap-based format. It features every course offered at WPI in the last eight semesters, along with a fairly accurate algorithm to represent how your degree requirements are computed by WPI, based off of the CS tracking sheet for the class of 2022. 

# Usage

There are two ways to add courses to the treemap:
* Importing from Bannerweb by entering your username & password then clicking the import button
* Clicking and dragging courses from the course catalog on the bottom of the screen

Courses added through either method will be slotted into the requirement area that they best match, accounting for existing classes and remaining credit hours. Additionally, the credit hour display on the right will be dynamically updated. To remove courses, one can either right click on them or hit the "Clear Tree" button to clear all courses.

# Achievements

## Technical Achievements
* Course catalog from last eight semesters obtained by crawling Banner
* Bannerweb course importer that initiates a Bannerweb session and crawls a user's transcript to report their courses

## Design Achievements
* Utilized Material Components for the Web in order to style our page nicely
* Matched colors of tree map up with material design color palette
