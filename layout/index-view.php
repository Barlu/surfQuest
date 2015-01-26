
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
                        <select class='navSelect citySelection' onchange="mapModule.setLocation(this.options[this.selectedIndex].text)">
                            <option>Select nearest location...</option>
                        </select>
                    </li>
                    <li>
                        <select class='navSelect beachSelection' onchange="mapModule.setBeach(this.options[this.selectedIndex].text)">
                            <option>Select a beach...</option>
                        </select>
                    </li>
                </ul>
            </nav>

            <div id="contentWrapper">
                <?php
                require $template
                ?>

                <nav class="handheld">
                    <ul>
                        <li>
                            <a href="index.php?page=home">
                                <i class='fa fa-location-arrow <?php echo $locate;?>'></i>
                            </a>
                        </li>
                        <li>
                            <a href="index.php?page=manual">
                                <i class="fa fa-search <?php echo $search;?>"></i>
                            </a>
                        </li>
                        <li>
                            <i class="fa fa-star-o <?php echo $favorites;?>"></i>
                        </li>
                        <li>

                            <i class="fa fa-question <?php echo $help;?>"></i>

                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </body>
</html>