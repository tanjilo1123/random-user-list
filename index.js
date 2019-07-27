(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const userListPanel = document.getElementById('userListPanel')
  const data = []
  const searchButton = document.getElementById('search-button')
  const searchInput = document.getElementById('search-input')
  const searchBar = document.getElementById('navbarSupportedContent')
  const home = document.getElementById('home')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 18
  let paginationData = []
  const changeIconPanel = document.getElementById('change-icon-panel')
  let modeChange = 'card-mode'
  let nowPage = 1

  /**********************************************
        User List home press
  **********************************************/

  home.addEventListener('click', event => {
    searchInput.value = ''
    getTotalPages(data)
    getPageData(1, data)
    searchBar.classList.remove('show')
  })

  /**********************************************
        get url data
  **********************************************/
  axios.get(INDEX_URL).then(response => {
    data.push(...response.data.results)
    // displayAllUser(data)
    getTotalPages(data)
    getPageData(1, data)
  })

  /**********************************************
        display user
  **********************************************/
  function displayAllUser(data, mode) {
    let htmlContent = ''
    mode = modeChange || mode
    for (let item of data) {
      if (mode === 'card-mode') {
        htmlContent += `
          <div class="col-sm-3 col-md-2 mb-2">
            <div class="card border-white">
              <div><i class="far fa-heart" id="${item.id}"></i></div>
              <a href="#">
                <img class="card-img-top" src="${item.avatar}" data-id="${item.id}" data-toggle="modal"  data-target="#showModalCenter" alt="card image cap">
              </a>
              <span>${item.name} ${item.surname}</span>
            </div>
          </div>
        `
      } else {
        htmlContent += `
            <div class="row w-100 mt-3 mb-3 pt-4 align-items-center" id="list-item">
              <div class="col-xs-4 col-sm-7 col-md-9">
                <h6>${item.surname} ${item.name}</h6>
              </div>
              <div class="col-auto">
                <button class="btn btn-primary mr-2" data-toggle="modal" data-target="#showModalCenter" data-id="${item.id}">More</button>
              </div>
              <div><span class="far fa-heart" id="${item.id}"></span></div>
            </div>
          `
      }

    }
    userListPanel.innerHTML = htmlContent
  }

  /**********************************************
        add listener for Modal
  **********************************************/
  userListPanel.addEventListener('click', event => {
    if (event.target.tagName === 'IMG' || event.target.matches('.btn')) {
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.fa-heart')) {
      favoriteEvent(event.target)
    }
  })

  /**********************************************
        favorite event
  **********************************************/
  function favoriteEvent(event) {
    // change heart style
    if (event.matches('.far')) {
      event.classList.replace('far', 'fas')
      event.classList.add('heart-fill')
      addFavoriteItem(event.id)
    } else if (event.matches('.fas')) {
      event.classList.replace('fas', 'far')
      event.classList.remove('heart-fill')
      removeFavoriteItem(event.id)
    }
  }
  /**********************************************
        add favorite item to localStorage
  *********************************************/
  function addFavoriteItem(id, style) {
    const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
    const user = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      removeFavoriteItem(id)
    } else {
      list.push(user)
    }
    localStorage.setItem('favoriteUser', JSON.stringify(list))
  }

  /**********************************************
        remove favorite item from localStorage
  *********************************************/
  function removeFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUser'))
    const user = list.find(item => item.id === Number(id))

    list.splice(list.indexOf(user), 1)
    localStorage.setItem('favoriteUser', JSON.stringify(list))
    // console.log(id)
  }
  /**********************************************
        show user in modal
  **********************************************/
  function showUser(id) {
    const userTitleModal = document.getElementById('user-title-modal')
    const showAvatarModal = document.getElementById('show-avatar-modal')
    const showGenderModal = document.getElementById('show-gender-modal')
    const showBirthdayModal = document.getElementById('show-birthday-modal')
    const showRegionModal = document.getElementById('show-region-modal')
    const showAgeModal = document.getElementById('show-age-modal')
    const showEmailModal = document.getElementById('show-email-modal')

    const url = INDEX_URL + id

    axios.get(url).then(response => {
      const data = response.data
      userTitleModal.textContent = `${data.name} ${data.surname}`
      showAvatarModal.innerHTML = `<img src="${data.avatar}">`
      showGenderModal.textContent = `Gender: ${data.gender}`
      showBirthdayModal.textContent = `Birthday: ${data.birthday}`
      showRegionModal.textContent = `Region: ${data.region}`
      showAgeModal.textContent = `Age: ${data.age}`
      showEmailModal.textContent = `Email: ${data.email}`
    })
  }

  /**********************************************
        search function
  **********************************************/
  searchButton.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(userName => userName.name.match(regex))
    getTotalPages(results)
    getPageData(1, results)

    searchBar.classList.remove('show')

  })

  /**********************************************
        get total pages
  **********************************************/
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  /**********************************************
        pagination listener
  **********************************************/
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      nowPage = event.target.dataset.page
      getPageData()
    }
  })

  /**********************************************
        get page data function
  **********************************************/
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    pageNum = nowPage
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayAllUser(pageData, modeChange)
  }


  /**********************************************
        listen change icon panel
  **********************************************/
  changeIconPanel.addEventListener('click', event => {
    if (event.target.tagName === 'I') {
      modeChange = event.target.id
      getPageData(nowPage, data)
    } else {
      return
    }
  })
})()


