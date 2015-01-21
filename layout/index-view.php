
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $title?></title>
        
        <meta name="description" content=""/>
        <meta name="author" content=""/>
        <meta name="keywords" content=""/>

        <link rel="stylesheet" type="text/css" href="css/normalize.css"/>
        <link rel="stylesheet" href="css/style.css"/>
        
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCfbWr8FgN2JgQIDC6go0BfffsrbBZN5Rg"></script> 
        
    </head>
    <body onload="initialize()">
        
        <?php 
        require $template
        ?>
    
       
    <script type="text/javascript" src="js/main.js"></script>
    
    </body>
</html>