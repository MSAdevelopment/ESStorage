How to use:


first you should add lib to your project


you can Set, Get, See items in your local Storage but with more security and Easy to use.


Set example:


es("Your Key" , "Your Content" , "your password")



Get Example:


const data = es("Your Key" , undefined , "your password") Tip: if you want to get an item with ESStorage you should set the second key>> undefined << to get the item


Read Example:


esShowAll(Master_Key*) / Tip: shows all data in ESStorage


*Master key toturial:


you should set password for first time like this:


esShowAll("your Master key")


and then run your project;
then delete your master key inside esShowAll function
and when you want to see all; you should write this:
esShowAll("your setted Master key before")
to show you the keys saved; 


MSA Development;
