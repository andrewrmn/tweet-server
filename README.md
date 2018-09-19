# Tweet via Javascript Twitter Server
Simple Server that waits for POST requests to tweets content. Works nicely for static websites, in my case — a Jekyll website hosted on GitHub Pages.


## Instructions
1. Create your APP and get your keys [here](https://apps.twitter.com/)
2. Create a new [Heroku App](https://dashboard.heroku.com/apps)
3. In your new Heroku App, go to settings and create new Config Vars called `CONSUMER_KEY`, `CONSUMER_SECRET`, `ACCESS_TOKEN` and `ACCESS_TOKEN_SECRET` and enter your corresponding keys in the value fields
4. Clone this repo
5. Deploy your app via the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) or hook up your GitHub repository via the Deploy tab in your Heroku App
6. After you deploy your app, your app url should display 'Waiting for tweets'


## Client-Side Instructions
1. We need to send our form data to our Heroku App. Our form submit function should look something like this:

<pre><code>
  form.addEventListener("submit", function(e){
      var data = form.serialize();

      fetch('YOUR HEROKU APP URL HERE', {
        method:'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-type':'application/json'
        },
        body:JSON.stringify(data)
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.success);
        if( data.success === true ){
            // Show success message
        }
      });
  });
</code></pre>

2. If the tweet was created successfully we should receive a success message in the console and also see our new tweet in our profile!
