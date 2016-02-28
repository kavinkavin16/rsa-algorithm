//Function to replace a char of a string
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

//Initializing the controller
var app = angular.module('app',[]);
app.controller('MainController', MainController);
MainController.$inject = ['$scope'];

//Main Controller
function MainController($scope) {
    var rsa = $scope;
    
    rsa.randomize = function(number_str) {
        var randomize_str = number_str;
        for (var i = 0; i < randomize_str.length; i++) {
            if (!isNaN(+randomize_str[i]))
                randomize_str = randomize_str.replaceAt(i,String.fromCharCode(48 + Math.floor((Math.random() * 10))));
            else if (randomize_str[i] == '+')
                break;
        }
        return randomize_str;
    };
    
    rsa.generatePrime = function() {
        
        //Util numbers as Big Objects
        var zero = new Big("0");
        var one = new Big("1");
        var two = new Big("2");
        
        //Generate small primes (3 to 7919)
        //I could use the crive here, but there is no need, 
        //because the interval is too short..
        
        var smallPrimes = [];
        for (var i = 3; i <= 7919; i++) {
            var isPrime = true;
            for (var j = 0; j <= Math.sqrt(i); j++)
                if (i % j == 0) isPrime = false;
            if (isPrime == true) {
                smallPrimes.push(new Big(i));
                //
                console.log("Small prime: " + i);
                //
            }
        }
        
        //Biggest 128 bits number
        var maxnumber_str = new Big(2).pow(128).minus(1).toString();
        
        //
        console.log("Max 128 bits number: " + maxnumber_str);
        //
        
        //Generate random candidate, randomizing digits of the biggest number
        //and removing the first digit (so the generated number is always smaller)
        var candidate_str = rsa.randomize(maxnumber_str);
        candidate_str = candidate_str.replaceAt(0,"0");
        
        var candidate = new Big(candidate_str);
        
        //If even, subtract 1
        if (candidate.mod(2).eq(zero))
            candidate = candidate.minus(1);
        
        //Testing candidates..
        while (true) {
            
            //Subtract 2 (next candidate)
            candidate = candidate.minus(2);
            
            //
            console.log("Candidate: " + candidate.toString());
            //
            
            //Test candidate against small primes
            for (var i = 0; i < smallPrimes.length; i++)
                if (candidate.mod(smallPrimes[i]).eq(zero))
                    continue;
            
            //Generate a random number smaller than the candidate
            var random_str = rsa.randomize(candidate.toString());
            random_str = random_str.replaceAt(0,"0");
            var random_number = new Big(random_str);
            
            console.log("Random number 1: " + random_str);
            
            //Fermat Primality Test
            if(random_number.pow(candidate.minus(one)).mod(candidate).eq(one) == false) 
                continue;
            
            var miller_test = true;
            
            //Miller-Rabin Primality Test --> 10 times
            for (var it = 0; it < 10; it++) {
                
                //Generate another random number smaller than the candidate
                random_str = rsa.randomize(candidate.toString());
                random_str = random_str.replaceAt(0,"0");
                random_number = new Big(random_str);

                //
                console.log("New number: " + random_str);
                //
                
                //Calculate r and d as (candidate-1) = 2^r * d
                var d = new Big(candidate.sub(one));
                var a = new Big(one);
                while (d.mod(two).eq(zero)) {
                    d = d.div(two);
                    a = a.mult(two);   
                }
                
                //
                console.log("D: " + d.toString());
                console.log("A: " + a.toString());
                //
                
                //Calculate x and test if it is one or candidate-1
                var x = random_number.pow(d).mod(candidate);
                if (x.eq(one) || x.eq(candidate.minus(one)))
                    continue;
            
                //
                console.log("X = " + x.toString());
                //
                
                for (var i = 0; i < parseInt(r.minus(1).toString()); i++) {
                    x = x.pow(2).mod(candidate);
                    if (x.eq(one)) {
                        miller_test = false;
                        break;
                    }
                    if (x.eq(candidate.minus(1)))
                        break;
                }
            }
            
            //Possible prime found
            break;
        }
        
        return prime;
    };
    
    rsa.generateE = function() {
        // Relatively prime to (p-1)(q-1)
        return e;
    };
    
    rsa.generateD = function() {
        // e*d mod (p-1)(q-1) = 1
        return d;
    };
    
    rsa.encrypt = function(message) {
        // c = m^e mod n
        return encrypted;
    };
    
    rsa.decrypt = function(message) {
        // m = c^d mod n
        return decrypted;
    };
    
    rsa.generateKeys = function() {
        
        rsa.p = rsa.generatePrime();
        rsa.q = rsa.generatePrime();
        
        rsa.n = rsa.p.times(rsa.q);
        
        rsa.e = rsa.generateE();
        rsa.d = rsa.generateD();
        
        rsa.$watch('to_encrypt', function(to_encrypt) {
            rsa.encrypted = rsa.encrypt(to_encrypt);
        }, true);
        
        rsa.$watch('to_decrypt', function(to_decrypt) {
            rsa.decrypted = rsa.decrypt(to_decrypt);
        }, true);
    }
}
