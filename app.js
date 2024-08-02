$(function() {
  let currentUserId = 1;
  const totalUsers = 30;

  function getUserById(userid){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}`,
        type: 'GET',
        success: function(response) {
          resolve(response);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }

  function getPostById(userid){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/posts`,
        type: 'GET',
        success: function(response) {
          resolve(response);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }

  function getTodoById(userid){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/todos`,
        type: 'GET',
        success: function(response) {
          resolve(response);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }

  function updateUserInfo(user) {
    $('.info__image img').attr('src', user.image);
    $('.info__content').html(`
      <h1>${user.firstName} ${user.lastName}</h1>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    `);
  }

  function updatePosts(user, posts) {
    if (posts.length > 0) {
      const postsHtml = posts.map(post => `
        <li>
          <h4 class="post-title" data-id="${post.id}">${post.title}</h4>
          <p>${post.body}</p>
        </li>
      `).join('');
      $('.posts h3').text(`${user.firstName}'s Posts`);
      $('.posts ul').html(postsHtml);
    } else {
      $('.posts h3').text(`${user.firstName}'s Posts`);
      $('.posts ul').html('<li>User has no posts</li>');
    }
  }

  function updateTodos(user, todos) {
    if (todos.length > 0) {
      const todosHtml = todos.map(todo => `
        <li>
          <p>${todo.todo}</p>
        </li>
      `).join('');
      $('.todos h3').text(`${user.firstName}'s Todos`);
      $('.todos ul').html(todosHtml);
    } else {
      $('.todos h3').text(`${user.firstName}'s Todos`);
      $('.todos ul').html('<li>User has no todos</li>');
    }
  }

  $('.posts h3').click(function() {
    $(this).next('ul').slideToggle();
  });

  $('.todos h3').click(function() {
    $(this).next('ul').slideToggle();
  });

  function showModal(post) {
    const modalHtml = `
      <div class="overlay">
        <div class="modal">
          <h2>${post.title}</h2>
          <p>${post.body}</p>
           <p><i>Views: ${post.views}</i></p>
          <button>Close Modal</button>
        </div>
      </div>
    `;
    $('body').append(modalHtml);

    $('.modal button').click(function() {
      $('.overlay').remove();
    });
  }

  function loadUserData(userId) {
    getUserById(userId)
      .then(user => {
        updateUserInfo(user);
        return Promise.all([getPostById(userId), getTodoById(userId), user]);
      })
      .then(([posts, todos, user]) => {
        updatePosts(user, posts.posts);
        updateTodos(user, todos.todos);
      })
      .catch(error => {
        console.error('Error loading user data:', error);
      });
  }

  $('button').each(function() {
    const buttonText = $(this).text().trim();
    if (buttonText === '< Previous User') {
      $(this).click(function() {
        if (currentUserId > 1) {
          currentUserId--;
        } else {
          currentUserId = totalUsers;
        }
        loadUserData(currentUserId);
      });
    } else if (buttonText === 'Next User >') {
      $(this).click(function() {
        if (currentUserId < totalUsers) {
          currentUserId++;
        } else {
          currentUserId = 1;
        }
        loadUserData(currentUserId);
      });
    }
  });

  $(document).on('click', '.post-title', function() {
    const postId = $(this).data('id');
    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      type: 'GET',
      success: function(post) {
        showModal(post);
      },
      error: function(error) {
        console.error('Error loading post details:', error);
      }
    });
  });

  loadUserData(currentUserId);
});