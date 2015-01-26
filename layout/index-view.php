
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $title ?></title>

        <meta name="description" content=""/>
        <meta name="author" content=""/>
        <meta name="keywords" content=""/>

        <link rel="stylesheet" type="text/css" href="css/normalize.css"/>
        <link rel="stylesheet" href="css/style.css"/>
        <link rel="stylesheet" href="css/jquery.swellmap.css"/>
        <link rel="stylesheet" href="font-awesome-4.3.0/css/font-awesome.min.css"/>
        <script type="text/javascript" src="js/jquery-1.11.2.min.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCfbWr8FgN2JgQIDC6go0BfffsrbBZN5Rg&sensor=true&libraries=geometry"></script> 
        <script type="text/javascript" src="js/data.js"></script>
        <script type="text/javascript" src="js/main.js"></script>

        
        <script type="text/javascript" src="js/jquery.swellmap.js"></script>

    </head>
    <body onload='generateElements()'>
        <div id="wrapper">
            <header>
                <img id="banner">
            </header>
            <nav class="desktop">
                <ul>
                    <li><a>Home</a></li>
                    <li>
                        <select id='citySelection' onchange="mapModule.setLocation(this.options[this.selectedIndex].text)">
                            <option>Select your nearest town/city...</option>
                        </select>
                    </li>
                    <li>
                        <select id='beachSelection' onchange="mapModule.setBeach(this.options[this.selectedIndex].text)">
                            <option>Select a beach...</option>
                        </select>
                    </li>
                </ul>
            </nav>

            <?php
            require $template
            ?>

            <nav class="handheld">

            </nav>
        </div>
    </body>
</html>