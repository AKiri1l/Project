export function createCard(item, deleteFunction, likeFunction, unlikeFunction, openImagePopup, userId) {
    const template = document.querySelector('#card-template').content;
    const templateElement = template.querySelector('.card').cloneNode(true);
    const cardImage = templateElement.querySelector('.card__image');
    const cardContent = templateElement.querySelector('.card__title');
    const cardLikeValue = templateElement.querySelector('.card__like-value');
    const likeButton = templateElement.querySelector('.card__like-button');
    cardImage.src = item.link;
    cardImage.alt = item.name;
    cardContent.textContent = item.name;
    cardLikeValue.textContent = item.likes.length;

    const deleteButton = templateElement.querySelector('.card__delete-button');
    if(item.owner._id != userId){
        deleteButton.remove();
    }else{
        deleteButton.addEventListener('click', (event) => {
            deleteFunction(item._id)
                .then(() => event.target.closest('.card').remove())
                .catch((err) => {
                    console.log(err); 
                });
        });
    }

    likeButton.addEventListener('click', (event) => {
        if(event.target.classList.contains('card__like-button_is-active')){
            unlikeFunction(item._id)
            .then(data => {
                cardLikeValue.textContent = data.likes.length;
                event.target.classList.toggle('card__like-button_is-active');
            })
            .catch((err) => {
                console.log(err);
              });
        }else{
            likeFunction(item._id)
            .then(data => {
                cardLikeValue.textContent = data.likes.length;
                event.target.classList.toggle('card__like-button_is-active');
            })
            .catch((err) => {
                console.log(err);
              });
        }
    });

    if(item.likes.some(element => {
        return element._id == userId
    })){
        likeButton.classList.add('card__like-button_is-active');
    }

    cardImage.addEventListener('click', openImagePopup);

    return templateElement;
}