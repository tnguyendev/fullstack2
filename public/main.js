    document.querySelector(".deleteAll").addEventListener('click', function(){
        fetch('/profile', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'list': list
          })
        }).then(function (response) {
          window.location.reload(true)
        })
      });

      document.querySelector(".deleteAuthorLines").addEventListener('click', function(){

        fetch('/profile', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }).then(function (response) {
          window.location.reload(true)
        })
      });
