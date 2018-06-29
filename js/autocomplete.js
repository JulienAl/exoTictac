document.addEventListener("DOMContentLoaded", function() {
    
    var ul = document.createElement('ul');                

    // APPEL AJAX
    function ajaxCall(valueAjax, currentInput) {

        function getXMLHttpRequest() {
            var xhr = null;
        
            if (window.XMLHttpRequest || window.ActiveXObject) {
                if (window.ActiveXObject) {
                        try {
                                xhr = new ActiveXObject("Msxml2.XMLHTTP");
                        } catch(e) {
                                xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                } else {
                        xhr = new XMLHttpRequest();
                }
            } else {
                alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
                return null;
            }
        
            return xhr;
        }
    
        var xhr = getXMLHttpRequest();
    
        xhr.open("GET", valueAjax, true);
        xhr.send();
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var cities = JSON.parse(xhr.responseText);
                
                // Initialisation du contenu dans le DOM
                if(!document.getElementById('resultList')){ 
                    ul.setAttribute('id', 'resultList'); 
                    document.getElementById('result').appendChild(ul); 
                } else {
                    document.getElementById('resultList').innerHTML = ''; 
                }

                for (var i = 0; i < 5; i++) {
                    var city = cities[i];
                    var cityName = city.unique_name;
                    var listItem = document.createElement('li');
                    listItem.innerHTML = cityName;  
                    document.getElementById('result').firstElementChild.appendChild(listItem); //on ajoute le li dans la liste
                
                    // Envoi item choisi dans input
                    listItem.addEventListener('click', function(){
                        document.getElementById(currentInput).value = this.innerHTML;
                        document.getElementById(currentInput).name = this.innerHTML;        
                        });
                    }                        
                
            } else {
                console.log(xhr.status);
            };
        }
    }

    // LISTE DESTINATIONS POPULAIRES
    ajaxCall("http://www-uat.tictactrip.eu/api/cities/popular/5", "inputAutocomplete");
    

    // AUTOCOMPLETE
    document.getElementById('inputAutocomplete').addEventListener('focus', function(){

        //Appel de la liste destinations populaires
        if(document.getElementById('result').firstElementChild){
            document.getElementById('result').firstElementChild.innerHTML = '';
            ajaxCall("http://www-uat.tictactrip.eu/api/cities/popular/5", "inputAutocomplete");
            document.getElementById('trainstation').innerHTML = "Choisissez une gare de départ";
        }
        document.getElementById('inputAutocomplete').addEventListener('keyup', function(e) {
            if (this.value.length >= 1) {
    
                var inputFrom = document.getElementById('inputAutocomplete').value;
    
                // 1 Appel AJAX
                ajaxCall("http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=" + inputFrom, "inputAutocomplete");  
            } else {
                if(document.getElementById('result').firstElementChild){
                    document.getElementById('result').firstElementChild.innerHTML = '';
                    document.getElementById('trainstation').innerHTML = "Choisissez une gare de départ";
                }
            }
        });
    });
    

    //SUGGESTIONS UNIQUE_NAME
    document.getElementById('inputTo').addEventListener('focus', function() {
        var inputFromValue = document.getElementById('inputAutocomplete').name;

        if(document.getElementById('result').firstElementChild){
            document.getElementById('result').firstElementChild.innerHTML = '';
            document.getElementById('trainstation').innerHTML = "Choisissez une gare d'arrivée";
            ajaxCall("http://www-uat.tictactrip.eu/api/cities/popular/from/" + inputFromValue + "/5", "inputTo");
        }

        document.getElementById('inputTo').addEventListener('keyup', function(e) {
            if (this.value.length >= 1) {            
                var inputTo = document.getElementById('inputTo').value;
    
                // 1 Appel AJAX
                ajaxCall("http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=" + inputTo, "inputTo");  
            } else {
                if(document.getElementById('result').firstElementChild){
                    document.getElementById('result').firstElementChild.innerHTML = '';
                    document.getElementById('trainstation').innerHTML = "Choisissez une gare de départ";
                }
            }
        });
    });
});

