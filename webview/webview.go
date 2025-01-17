// webview.go
package webview

import webview "github.com/webview/webview_go"

func CreateWebview() {
	debug := true
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("Will Translate")
	w.SetSize(1200, 800, webview.HintNone)
	w.Navigate("http://localhost:8080")
	w.Run()
}