# LeetCode to Markdown

## Description
A small Google Chrome extension that scans a LeetCode problem page, extracts the title and description, formats them as GitHub-friendly markdown, and downloads them as a ReadMe file.
To be used when intending to upload your LeetCode solutions to GitHub to easily include the problem description together with your code.

## Installation
Fetch the files from the repository (you can opt to skip the /test folder if you have no need to tweak the code), then load it unpacked as per [the Google tutorial here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
(This is a small extension created primarily for personal use, so I do not have a Chrome Store version for easy download. 😅

## Usage
Navigate to the page of the problem whose description you want to fetch as markdown (e.g. [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/)), then click the extension icon and select 'Scan and Download'.

![image](https://github.com/user-attachments/assets/35e3f444-7649-40f8-b17d-6be3bb5f93f8)

If all is well, the extension will download a README.md file matching the problem description. Descriptions can be pretty diverse, so it's a good idea to check the output of the extension to see that nothing important is wrong. If something _does_ go wrong, checking the browser console might provide some hints on how to address it (if you feel like tinkering with code).
