function dateFormat (date = new Date()){
    const days =['Sundays','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
    const day= date.getDate()
    const hour = String(date.getHours).padStart(2,'0')
    const minute = String(date.getMinutes()).padStart(2,'0')

   return `${days[date.getDay()]} ${date.getDate()} ${date.getMonth()}  ${date.getFullYear()}  ${hour} : ${minute}`
   

} 
 dateFormat()
