# Controle alt delete
[Link naar live demo](https://emmaoudmaijer.github.io/controlealtdelete-3/public/)

Tijdens het project voor information design hebben we een datavisualisatie gemaakt voor Controle alt delete. meer info

![foto](public/images/bubblechart.png)

### Het concept:

Door de Hogeschool van Amsterdam is ons een opdrachtgever toegewezen, Controle Alt Delete. Dit is een organisatie die zich focust op etnisch profileren bij de politie. Ze zetten zich in tegen etnisch profileren. Amnesty International is een samenwerkings- partner van Controle Alt Delete. Ze richten zich echter niet alleen op de politie maar ook op bijvoorbeeld BOA’s en de Koninklijke Marechaussee. Met dit project hebben we alleen met de politie te maken. Easy Solutions is een onderneming waar Controle Alt Delete een project van is. Ze verstoppen dit omdat Easy Solutions meerdere opdrachtgevers heeft die dit een heel spannend/politiek onderwerp kunnen vinden (denk aan de gemeente, etc.). Controle Alt Delete wordt als organisatie gepresenteerd, terwijl het eigenlijk een project is. Het is verder geregistreerd als een B.V. dat geen winst maakt. Wij burgers weten niet wat de omvang van etnisch profileren is. Daardoor kunnen wij niet meten of de maatregelen die de politie neemt het gewenste effect hebben.

### Doelstelling
De doelstelling is om door middel van onafhankelijke onderzoek cijfers te verzamelen die sterke indicaties geven voor de omvang van etnisch profileren in Nederland.
Aan ons de vraag om deze data te doorzoeken, visueel inzichtelijk maken en aan te sluiten
op de huisstijl. Wij willen met dit project een verhaal vertellen en in procenten laten zien welke Nederlanders met een culturele afkomst het meest in contact is geweest met de politie in de afgelopen 12 maanden. Dit kan je zien in combinatie met hoeveel procent van de groep zelf naar de politie is gestapt of dat de politie naar hun kwam.

### Doelgroep
Onze website is bedoeld voor de orginatisoren van controle alt delete, maar ook voor mensen die vinden dat ze onterecht zijn behandeld door de politie en die via controle alt delete op deze pagina terecht zijn gekomen. Zo krijgen de bezoekers van de website een indicatie van hoe het contact met de politie tot stand komt en wat voor effect dit heeft met de culturele afkomsten. Ook is de website bedoeld voor de politie om hun ook een indicatie te geven van hoe het contact is verdeeld.

## De visualisaties




## Data 
Controle Alt Delete heeft onderzoek gedaan door een enquête af te leggen in Amsterdam. Dit hebben zij gedaan om de ervaring van Amsterdammers met etnisch profileren in kaart te brengen. De respondenten hebben verschillende culturele afkomsten, namelijk: Nederlands, Marokkaans, Turks, Surinaams, Nederlands Antilliaans, etc. Een aantal respondenten hebben de vraag over de afkomst niet ingevuld. Deze respondenten zijn in de  datavisualisaties niet meegerekend. Door middel van onafhankelijk onderzoek cijfers verzamelen die sterke indicaties geven voor de omvang van etnisch profileren in Nederland.
                                        

```js
function dataOmzet() {
	let result = fetch("convertcsvdata.json")
		.then(data => data.json())
		.then(json => {
			const newResults = json.map(result => {
				return {
					id: result.response_ID,
					afkomst: result.Herkomst_def,
					totstand: result.Totstand,
					contact: result.Contact_gehad,
					freqcontact: result.freqcontact,
					cijfer: result.rapportcijfer
				}
			})
			bubbleChart(newResults)
		})
}
dataOmzet()
```

## Install project
Clone deze repository naar je computer:
```
git clone https://github.com/emmaoudmaijer/controlealtdelete-3.git
```
Ga naar de map in je terminal
```
cd frontend-data
```
Installeer packages
```
npm install
```

### Bronnen

* [https://bl.ocks.org/HarryStevens/54d01f118bc8d1f2c4ccd98235f33848](https://bl.ocks.org/HarryStevens/54d01f118bc8d1f2c4ccd98235f33848)
* [https://www.d3-graph-gallery.com/graph/scatter_animation_start.html](https://www.d3-graph-gallery.com/graph/scatter_animation_start.html)
* [https://bl.ocks.org/ctufts/f38ef0187f98c537d791d24fda4a6ef9](https://bl.ocks.org/ctufts/f38ef0187f98c537d791d24fda4a6ef9)
* [https://codepen.io/girliemac/pen/cDfmb/](https://codepen.io/girliemac/pen/cDfmb/)
* [http://vallandingham.me/bubble_chart_v4/](http://vallandingham.me/bubble_chart_v4/#)
* [https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a/c5660429ab70f58ba18c6edc70f3a9ae92bcbf47](https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a/c5660429ab70f58ba18c6edc70f3a9ae92bcbf47)
* [https://stackoverflow.com/questions/39176404/d3-js-clustering-bubbles-to-segments](https://stackoverflow.com/questions/39176404/d3-js-clustering-bubbles-to-segments)
* [https://bl.ocks.org/SpaceActuary/d6b5ca8e5fb17842d652d0de21e88a05](https://bl.ocks.org/SpaceActuary/d6b5ca8e5fb17842d652d0de21e88a05)
* [https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp](https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp)

## Licence
ISC - Emma Oudmaijer