
const fetch = require("node-fetch") 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const CREDITIALS = '';
const SECRET = ''

function get_token() {
    return fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${CREDITIALS}`,
            'RqUID': SECRET
        },
        body: new URLSearchParams({
            'scope': 'GIGACHAT_API_PERS'
        })
    }).then((response) => response.json())
}

async function ask(message, history=[]) {
    body = await get_token().then(body=>{
        token = body.access_token
        history.push({
            'role': 'user',
            'content': message,
        })
        return fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              'model': 'GigaChat:latest',
              'messages': history,
              'temperature': 0.7
            })
          })
    }).then((response) => response.json())

    if (body.status){
        return body
    }else{
        return body.choices[0].message.content
    }
    
}


HISTORY = [
    {
        'role': 'user',
        'content': 'Create a poem for me on the theme "Spring". Your answer should contain only the poem, without unnecessary comments.'
    },
    {
        'role': 'assistant',
        'content': `In the land of green fields and blooming flowers,
Where the sunlight dances upon every leaf,
There is a place where nature's melody rings,
And the air is filled with the scent of spring.

The gentle breeze caresses the air,
Whispering secrets to the listening ear,
As the buds on the trees begin to unfold,
Revealing their beauty in shades of gold.

The birds sing melodies of joy,
Soaring high in the sky above,
While the flowers dance in the gentle rain,
Embracing the season with open arms.

In spring, the world comes alive,
With colors bright and fragrances sweet,
And in this magical time of renewal,
We find solace and joy in its beauty and light.

So let us embrace the season of spring,
With its promise of new beginnings and hope,
And let its essence fill our hearts with joy,
Reminding us of the wonders that surround us still.`,
    },
    {
        'role': 'user',
        'content': 'Create a poem for me on the theme "Future". Your answer should contain only the poem, without unnecessary comments.'
    },
    {
        'role': 'assistant',
        'content': `The future is something that never was,
A world of possibilities, an endless maze.
It's a road that we travel, each day,
But it's also a destination, far away.

In the future, there may be wonders untold,
New discoveries, and worlds to behold.
It's a time when dreams come true,
Where anything is possible, just for you.

So let's imagine a future, bright and new,
Where peace and love prevail, and all is well.
A world where everyone has a chance,
To grow and flourish, beyond any bounds.

The future is ours to shape,
With hope and determination, we can make it great.
Let's embrace the possibilities,
And write our own destiny, one line at a time.`,
    },
    {
        'role': 'user',
        'content': 'Create a poem for me on the theme "Space". Your answer should contain only the poem, without unnecessary comments.'
    },
    {
        'role': 'assistant',
        'content': `In a world filled with chaos and confusion,
Space is what gives us tranquillity and serenity.
It is the void between stars,
Where galaxies dance eternally.

In the vastness of space,
Where time seems to stand still,
We find solace and solitude,
Away from the hustle and bustle of life.

The space between thoughts,
Is a portal to another dimension,
Where dreams and ideas take form,
And creativity flows uninhibited.

So let us embrace the word space
As it represents freedom and possibility,
To explore the unknown,
And discover wonders beyond our sight.

For in the space within ourselves,
Lies the key to happiness and fulfillment,
Let us cherish this precious commodity,
And make the most of every opportunity.`,
    },
]
async function generate_poem(word) {
    wordCheck = /^[A-Za-z]{2,20}$/
    if (wordCheck.test(word)) {
        poemCheck = /(\n)(?![а-яА-Я])/i
        poem = await ask(`Create a poem for me on the theme "${word}". Your answer should contain only the poem, without unnecessary comments.`, HISTORY)
        if (poemCheck.test(poem)){
            return poem;
        }else{
            return "Error";
        }
    }else{
        return "Error"
    }
}

// get_token().then((body)=>{
//     console.log(body.access_token)
// })

module.exports = {generate_poem};