<?php
    echo "string";
  $fileConent = file_get_contents("https://github.com/linxizhilu/blog/edit/master/readme.md") or die('failed to open ');
  echo $fileConent;

 ?>
