<template>


<div>


<div class="container-fluid">

  <div class="row">
  
    <div class="col-md-12" style="background-color:green;height:50px;"></div>
  
  </div>

</div>

<br>
<div class="container">

   <div class="row d-flex justify-content-evenly">
  
      <div class="col-md-3" style="background-color:blue;height:310px;width:355px;">
        <h1 class="text-right">BLOC 1</h1>
        <img src="../image/fondImage2.jpg" class="img-rounded" alt="Cinque Terre" width="310" height="236">
      </div>

      <div class="col-md-3" style="background-color:yellow;height:150px;width:355px;">
        <h2 style="text-align:center;">BLOC 2</h2>
      </div>

      <div class="col-md-3" style="padding:0;display:flex;flex-direction:column;justify-content:space-between;background-color:orange;height:150px;width:355px;">
      
        <div class="d-flex justify-content-end">
          <h3 class="mr-5">BLOC 3</h3>
        </div>

        <div>
          <h3>BLOC AMIS</h3>

          <form name="myForm" action="demo_form.asp" onsubmit="return validateForm()" method="post">
            Name: <input type="text" name="fname">
            <input type="submit" value="Submit">
            </form>



        </div>
      
      </div>
  
  </div>

</div>


</div>

</template>

<script>

export default {
  name:"Design",
 methods:{

validateForm(){

  var x = document.form["myForm"]["fname"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }

} 

 
 }
};
</script>

