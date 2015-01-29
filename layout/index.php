<?php
$title;
$locate = '';
$search = '';
$favorites = '';
$help = '';

switch($page){
    case 'home':
        $locate = 'highlight';
        $title = 'Home | SurfQuest | The best surf web app around giving you directions and forcasts';
        break;
    case 'manual':
        $search = 'highlight';
        $title = 'Search | SurfQuest | Manually select location and beaches to find directions and weather';
        break;
    case 'favorites':
        $favorites = 'highlight';
        $title = 'Favorites | SurfQuest | Check out a list of all your favorite spots';
        break;
    case 'help':
        $help = 'highlight';
        $title = 'Help | SurfQuest | Find out about how to use the app and whats it all about';
        break;
    default:
        $locate = 'highlight';
};

