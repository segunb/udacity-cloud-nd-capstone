# Serverless Capstone Project

This repo contains code that implements a serverless application (front and back end) that allows managment of Super hero profiles.

# Functionality of the application

This application will allow creating/removing/updating/fetching Super Hero items. Each Hero item can optionally have an attachment image. Each user only has access to Hero items that he/she has created.

# SuperHero items

Items contain the following fields:

* `superheroId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a Hero item
* `desc` (string) - Brief description of the Hero
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Hero
* `userId` (string) (optional) - Identity of the user who created the Hero


# Test

Unit tests have been implemented

You can execute these using: yarn run jest