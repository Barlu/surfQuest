<?php
$locate = '';
$search = '';
$favorites = '';
$help = '';

switch($page){
    case 'home':
        $locate = 'highlight';
        break;
    case 'manual':
        $search = 'highlight';
        break;
    case 'favorites':
        $favorites = 'highlight';
        break;
    case 'help':
        $help = 'highlight';
        break;
    default:
        $locate = 'highlight';
};

